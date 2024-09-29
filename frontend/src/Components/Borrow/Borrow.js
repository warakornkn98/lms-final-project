import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const token = localStorage.getItem('token');

const Borrow = () => {
    const [username, setUsername] = useState(''); 
    const [userData, setUserData] = useState(null);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [bookItemId, setBookItemId] = useState('');
    const [bookData, setBookData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState(null);
    const [currentBookItemId, setCurrentBookItemId] = useState('');

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            authtoken: `${token}`,
        },
    });

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get(`/users/${username}`);
            setUserData(response.data);
            fetchBorrowHistory(response.data.id);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchBorrowHistory(userData.id);
        }
    }, [userData]);

    const fetchBorrowHistory = async (userId) => {
        try {
            const response = await axiosInstance.get(`/borrow/${userId}`);
            setBorrowHistory(response.data);
        } catch (err) {
            console.error('Error fetching borrow history:', err);
        }
    };

    const fetchBookData = async () => {
        try {
            const response = await axiosInstance.get(`/bookitems/${bookItemId}`);
            setBookData(response.data);
        } catch (err) {
            console.error('Error fetching book data:', err);
        }
    };

    const handleBorrowBook = async () => {
        try {
            await axiosInstance.post('/borrow', {
                bookitem_id: bookData.bookitem_id,
                user_id: userData.id,
            });
            fetchBorrowHistory(userData.id);
            setBookItemId('');
            setBookData(null);
        } catch (err) {
            console.error('Error borrowing book:', err);
        }
    };

    const handleReturnBook = async (bookitemId) => {
        try {
            await axiosInstance.post('/return', { bookitem_id: bookitemId, user_id: userData.id });
            fetchBorrowHistory(userData.id);
        } catch (err) {
            console.error('Error returning book:', err);
        }
    };

    const handleChangeBorrower = () => {
        setUsername('');
        setUserData(null);
        setBorrowHistory([]);
        setBookItemId('');
        setBookData(null);
    };

    const confirmAction = (actionType, bookItemId) => {
        setAction(actionType);
        setCurrentBookItemId(bookItemId);
        setShowModal(true);
    };

    const handleConfirm = () => {
        setShowModal(false);
        if (action === 'borrow') {
            handleBorrowBook();
        } else if (action === 'return') {
            handleReturnBook(currentBookItemId);
        }
        setAction(null);
        setCurrentBookItemId('');
    };

    const [showUnreturned, setShowUnreturned] = useState(false); 

    const filteredHistory = showUnreturned
        ? borrowHistory.filter(borrow => !borrow.status)
        : borrowHistory;

        
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">ยืม-คืนหนังสือ</h1>

            {!userData && (
                <div className="row mb-3">
                    <div className="col-md-8 mx-auto">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-center mt-2"> {/* ใช้ Flexbox สำหรับกึ่งกลาง */}
                            <button className="btn btn-primary" onClick={fetchUserData}>
                                เพิ่มผู้ใช้งาน
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {userData && (
                <div className="card my-3">
                    <div className="card-body">
                        <h5 className="card-title">User Info</h5>
                        <p className="card-text">
                            <strong>ชื่อผู้ใช้:</strong> {userData.username}<br />
                            <strong>ชื่อ:</strong> {userData.firstname} {userData.lastname}<br />
                            <strong>Role:</strong> {userData.role}
                        </p>
                        <button className="btn btn-warning" onClick={handleChangeBorrower}>
                            เปลี่ยนผู้ใช้งาน
                        </button>
                    </div>
                </div>
            )}

            {userData && (
                <div className="card my-3">
                    <div className="card-body">
                        <h5 className="card-title">ข้อมูลการยืม</h5>
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="showUnreturned"
                                checked={showUnreturned}
                                onChange={() => setShowUnreturned(prev => !prev)} // Toggle filter
                            />
                            <label className="form-check-label" htmlFor="showUnreturned">
                                แสดงเฉพาะรายการที่ยังไม่คืน
                            </label>
                        </div>
                        {filteredHistory.length > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>รหัสการยืม</th>
                                        <th>รหัสเล่มหนังสือ</th>
                                        <th>วันที่ยืม</th>
                                        <th>วันกำหนดคืน</th>
                                        <th>วันที่คืน</th>
                                        <th>คืนหนังสือ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.map((borrow) => (
                                        <tr key={borrow.id}>
                                            <td>{borrow.id}</td>
                                            <td>{borrow.bookitem_id}</td>
                                            <td>{new Date(borrow.borrow_date).toLocaleDateString('th-TH')}</td>
                                            <td>{new Date(borrow.due_date).toLocaleDateString('th-TH')}</td>
                                            <td>{borrow.return_date ? new Date(borrow.return_date).toLocaleDateString('th-TH') : 'Not Returned'}</td>
                                            <td>
                                                {!borrow.return_date && (
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => confirmAction('return', borrow.bookitem_id)}
                                                    >
                                                        คืน
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>ไม่เจอรายการยืม</p>
                        )}
                    </div>
                </div>
            )}

            {userData && (
                <div className="card my-3">
                    <div className="card-body">
                        <h5 className="card-title">ยืมหนังสือ</h5>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                value={bookItemId}
                                onChange={(e) => setBookItemId(e.target.value)}
                                placeholder="Enter Book Item ID"
                            />
                        </div>
                        {/* Move the Fetch Book button below the input field */}
                        <button className="btn btn-secondary mb-3" onClick={fetchBookData}>
                            ค้นหาหนังสือ
                        </button>

                        {bookData && (
                            <div>
                                <p>
                                    <strong>รหัสเล่มหนังสือ:</strong> {bookData.bookitem_id}<br />
                                    <strong>ชื่อหนังสือ:</strong> {bookData.title}<br />
                                    <strong>สถานะ:</strong> {bookData.status}
                                </p>
                                <button
                                    className={`btn ${bookData.status === 'available' ? 'btn-success' : 'btn-secondary'} ${bookData.status !== 'available' ? 'disabled' : ''}`}
                                    onClick={bookData.status === 'available' ? () => confirmAction('borrow') : undefined}
                                >
                                    ยืม
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog" style={{ marginTop: '10%', maxWidth: '500px' }}>
                    <div className="modal-content border border-primary"> 
                        <div className="modal-header">
                            <h5 className="modal-title">ยืนยันการทำงาน</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>คุณต้องการ {action === 'borrow' ? 'borrow' : 'return'} หรือไม่?</p>
                        </div>
                        <div className="modal-footer d-flex justify-content-end">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>ยกเลิก</button>
                            <button type="button" className="btn btn-primary ms-2" onClick={handleConfirm}>ยืนยัน</button> 
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Borrow;
