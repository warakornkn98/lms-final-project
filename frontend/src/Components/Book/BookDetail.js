import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

function BookDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { book } = location.state || {};

    useEffect(() => {
        console.log(book);
        
    }, []);

    
    if (!book) {
        return <div>หนังสือไม่พบ!</div>;
    }
    
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div
                        style={{
                            width: '350px',
                            height: 'auto',
                            border: '10px solid #ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '50px',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <img
                            src={`data:image/jpeg;base64,${book.cover_image}`}
                            alt={book.name}
                            className="img-fluid rounded"
                        />
                    </div>
                
                </div>
                <div className="col-md-8">
                    <h1 className="mb-4">{book.title}</h1>
                    <p><strong>คำอธิบาย:</strong> {book.description}</p>
                    <p><strong>หมวดหมู่:</strong> {book.category}</p>
                    <p><strong>ผู้แต่ง:</strong> {book.author}</p>
                    <p><strong>สำนักพิมพ์:</strong> {book.publisher}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>ปีที่พิมพ์:</strong> {book.publication_year}</p>
                    <p><strong>จำนวนหน้า:</strong> {book.pages}</p>
                    <p><strong>ราคา:</strong> {book.price} บาท</p>
                    <p><strong>จำนวนเล่ม:</strong> {book.quantity}</p>
                    <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>
                        กลับ
                    </button>
                </div>
                
            </div>
        </div>
    );
}

export default BookDetail;
