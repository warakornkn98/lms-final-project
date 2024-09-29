import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalBooks: 0,
        booksByType: [],
        borrowedBooks: 0,
        borrowedBooksByMonth: [],
        availableBooks: 0,
        lostBooks: 0,
        borrowedThisYear: 0,
        borrowedThisMonth: 0,
        returnedOnTime: 0,
        returnedLate: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dashboard', {
                    headers: {
                        'authtoken': localStorage.getItem('token'),
                    }
                }); // Update with your API endpoint
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    // Data for pie chart
    const pieChartData = {
        labels: dashboardData.booksByType.map(category => category.name),
        datasets: [
            {
                data: dashboardData.booksByType.map(category => category.total_quantity),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Adjust colors as needed
            }
        ]
    };

    // Data for bar chart
    const barChartData = {
        labels: dashboardData.borrowedBooksByMonth
            .slice(-12) // Get the last 12 months
            .map(monthData => monthData.month),
        datasets: [
            {
                label: 'จำนวนการยืม',
                data: dashboardData.borrowedBooksByMonth
                    .slice(-12) // Get the last 12 data points
                    .map(monthData => monthData.total_borrowed),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };
    

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">แดชบอร์ด</h2>
            <Row>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>หนังสือทั้งหมด</Card.Title>
                            <Card.Text className="display-4">{dashboardData.totalBooks}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>หนังสือ (พร้อมยืม)</Card.Title>
                            <Card.Text className="display-4">{dashboardData.borrowedBooks}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>หนังสือ (อยู่ระหว่างการยืม)</Card.Title>
                            <Card.Text className="display-4">{dashboardData.availableBooks}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>หนังสือ (หาย)</Card.Title>
                            <Card.Text className="display-4">{dashboardData.lostBooks}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>จำนวนการยืมปีนี้</Card.Title>
                            <Card.Text className="display-4">{dashboardData.borrowedThisYear}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>จำนวนการยืมเดือนนี้</Card.Title>
                            <Card.Text className="display-4">{dashboardData.borrowedThisMonth}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>จำนวนการคืนตรงเวลา</Card.Title>
                            <Card.Text className="display-4">{dashboardData.returnedOnTime}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="mb-4 text-center">
                        <Card.Body>
                            <Card.Title>จำนวนการคืนไม่ตรงเวลา</Card.Title>
                            <Card.Text className="display-4">{dashboardData.returnedLate}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <h4 className="mt-4 text-center">จำนวนหนังสือตามหมวดหมู่</h4>
                    <Pie data={pieChartData} />
                </Col>
                <Col md={8}>
                    <h4 className="mt-4">จำนวนการยืมแต่ละเดือน</h4>
                    <Bar data={barChartData} />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
