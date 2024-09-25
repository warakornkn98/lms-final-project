import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const BooksTable = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const response = await axios.get('http://localhost:5000/api/books', {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        });
        setBooks(response.data);
    };

    const handleDelete = async (bookId) => {
        await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        });
        fetchBooks();
    };
    
    return (
        <div className="container">
        <br></br>
        <h2>ตารางหนังสือข้อมูล</h2>
        <br></br>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ภาพ</th>
                    <th>ชื่อหนังสือ</th>
                    <th>คำอธิบาย</th>
                    <th>ประเภทหนังสือ</th>
                    <th>ผู้แต่ง</th>
                    <th>สำนักพิมพ์</th>
                    <th>ปีที่พิมพ์</th>
                    <th>ISBN</th>
                    <th>ราคา</th>
                    <th>จำนวนหน้า</th>
                    <th>จำนวนเล่ม</th>
                    <th>แก้ไข</th>
                    <th>ลบ</th>
                </tr>
            </thead>
            <tbody>
                {books.map((book) => (
                    <tr key={book.book_id}>
                        <td>{book.book_id}</td>
                        <td>{book.cover_image}</td>
                        <td>{book.title}</td>
                        <td>{book.description}</td>
                        <td>{book.category_id}</td>
                        <td>{book.author_id}</td>
                        <td>{book.publisher_id}</td>
                        <td>{book.publication_year}</td>
                        <td>{book.isbn}</td>
                        <td>{book.price}</td>
                        <td>{book.pages}</td>
                        <td>{book.quantity}</td>
                        <td>
                            <button className="btn btn-warning">
                                <Link
                                    to={`/admin/updatebook/${book.book_id}`}
                                    style={{ color: "inherit", textDecoration: "none" }}
                                >
                                    Update
                                </Link>
                            </button>
                        </td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                        </td>
                        
                    </tr>
                ))}
            </tbody>
        </table>
        <button className="btn btn-danger ">
            <Link to="/admin/addbook" style={{ color: "inherit", textDecoration: "none" }}>
            Add new book
            </Link>
        </button>
        </div>
    );
};


export default BooksTable;
