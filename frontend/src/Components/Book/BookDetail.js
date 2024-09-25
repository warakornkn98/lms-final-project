import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const response = await axios.get(`http://localhost:5000/api/bookdetail/${id}`, {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        });
        setBook(response.data);
    };

    if (!book) {
        return <div>หนังสือไม่พบ!</div>;
    }
    
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                <img
                    src={`https://via.placeholder.com/300?text=${book.name}`} // Placeholder image or book.image if available
                    alt={book.name}
                    className="img-fluid rounded"
                />
                </div>
                <div className="col-md-8">
                <h1 className="mb-4">{book.name}</h1>
                <p><strong>คำอธิบาย:</strong> {book.desc}</p>
                <p><strong>ผู้แต่ง:</strong> {book.author}</p>
                <p><strong>สำนักพิมพ์:</strong> {book.publisher}</p>
                <p><strong>ปีที่พิมพ์:</strong> {book.publish_year}</p>
                <p><strong>ราคา:</strong> {book.price} บาท</p>
                <p><strong>จำนวนที่มี:</strong> {book.available_quantity}</p>
                <p><strong>จำนวนทั้งหมด:</strong> {book.total_quantity}</p>
                <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>
                    กลับ
                </button>
                </div>
                
            </div>
        </div>
    );
}

export default BookDetail;
