import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from "react-router-dom";

const UpdateBook = () => {
    const [booktype, setBooktype] = useState([]);
    const [author, setAuthor] = useState([]);
    const [publisher, setPublisher] = useState([]);
    const [book, setBook] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();

    
    useEffect(() => {
        fetchBooks();
        fetchBooktype();
        fetchAuthor();
        fetchPublisher();
    }, []);

    const fetchBooks = async () => {
        const response = await axios.get(`http://localhost:5000/api/books/${id}`, {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        });
        setBook(response.data);
    };

    const fetchBooktype = async () => {
        const response = await axios.get("http://localhost:5000/api/category", {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        })
        setBooktype(response.data);
    }

    const fetchAuthor = async () => {
        const response = await axios.get("http://localhost:5000/api/author", {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        })
        setAuthor(response.data);
    }
    const fetchPublisher = async () => {
        const response = await axios.get("http://localhost:5000/api/publisher", {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        })
        setPublisher(response.data);
    }

    const { name,desc,booktype_id,author_id,publisher_id,publish_year,price,total_quantity,available_quantity} = book;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:5000/api/book/${id}`,  {name,desc,booktype_id,author_id,publisher_id,publish_year,price,total_quantity,available_quantity} , {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        });
        navigate("/admin/books");
    };

    console.log(book)
    return (
        <div className="container mt-4">
            <h2>แก้ไขข้อมูลหนังสือ</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>ชื่อหนังสือ</label>
                    <input
                        type="text"
                        name="name"
                        value={book.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>คำอธิบาย</label>
                    <textarea
                        name="desc"
                        value={book.desc}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>ประเภทหนังสือ (Book Type ID)</label>
                    <select
                        className="form-control"
                        name="booktype_id"
                        value={book.booktype_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">กรุณาเลือก</option>
                        {booktype.map((booktype) => (
                        <option key={booktype.id} value={booktype.id}>
                            {booktype.name}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>ผู้แต่ง (Author ID)</label>
                    <select
                        className="form-control"
                        name="author_id"
                        value={book.author_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">กรุณาเลือก</option>
                        {author.map((author) => (
                        <option key={author.id} value={author.id}>
                            {author.name}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>สำนักพิมพ์ (Publisher ID)</label>
                    <select
                        className="form-control"
                        name="publisher_id"
                        value={book.publisher_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">กรุณาเลือก</option>
                        {publisher.map((publisher) => (
                        <option key={publisher.id} value={publisher.id}>
                            {publisher.name}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>ปีที่พิมพ์</label>
                    <input
                        type="number"
                        name="publish_year"
                        value={book.publish_year}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>ราคา</label>
                    <input
                        type="number"
                        name="price"
                        value={book.price}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>จำนวนทั้งหมด</label>
                    <input
                        type="number"
                        name="total_quantity"
                        value={book.total_quantity}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>จำนวนที่มีอยู่</label>
                    <input
                        type="number"
                        name="available_quantity"
                        value={book.available_quantity}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">บันทึก</button>
            </form>
        </div>
    );
};

export default UpdateBook;
