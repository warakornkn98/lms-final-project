import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const BooksManager = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [submitEvent, setSubmitEvent] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/category", {
                headers: { authtoken: `${localStorage.getItem('token')}` }
            });
            console.log(response);
            
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.error('Categories response is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/books', {
                headers: { authtoken: `${localStorage.getItem('token')}` }
            });
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };
    

    const handleUpdate = (book) => {
        console.log('Navigating with book data:', book); // Log here
        navigate('/admin/bookform', {
            state: {
                categories,
                initialBook: book,
            },
        });
    };

    const handleAdd = (book) => {
        console.log('Navigating with book data:', book); // Log here
        navigate('/admin/bookform', {
            state: {
                categories,
                initialBook: null,
            },
        });
    };
    const confirmDeleteAction = (book_id) => {
        
        setSelectedBook(book_id);
        setShowModal(true);
    };

    const handleDelete = async (book_id) => {

        try {
            const response = await axios.delete(`http://localhost:5000/api/books/${book_id}`, {
                headers: { authtoken: `${localStorage.getItem('token')}` }
            });

            if (response.status === 200) {
                fetchBooks();
            } else {
                console.error('Failed to delete book:', response.data);
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const getCategoryName = (id) => {
        const category = categories.find(cat => cat.category_id === id);
        return category ? category.name : 'Unknown Category';
    };

    return (
        <div className="container">
            <br />
            <h2 className="mb-4">ตารางข้อมูลหนังสือหนังสือ</h2>
            <button className="btn btn-success mb-4" onClick={() => handleAdd()}>เพิ่มหนังสือใหม่</button>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '5%' }}>ID</th>
                        <th style={{ width: '10%' }}>ภาพ</th>
                        <th style={{ width: '15%' }}>ชื่อหนังสือ</th>
                        <th style={{ width: '20%' }}>คำอธิบาย</th>
                        <th style={{ width: '10%' }}>ประเภทหนังสือ</th>
                        <th style={{ width: '10%' }}>ผู้แต่ง</th>
                        <th style={{ width: '10%' }}>สำนักพิมพ์</th>
                        <th style={{ width: '5%' }}>ปีที่พิมพ์</th>
                        <th style={{ width: '10%' }}>ISBN</th>
                        <th style={{ width: '5%' }}>ราคา</th>
                        <th style={{ width: '5%' }}>จำนวนหน้า</th>
                        <th style={{ width: '5%' }}>จำนวนเล่ม</th>
                        <th style={{ width: '5%' }}>แก้ไข</th>
                        <th style={{ width: '5%' }}>ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.book_id}>
                            <td>{book.book_id}</td>
                            <td>
                                <div style={{
                                    width: '100px', 
                                    height: 'auto', 
                                    overflow: 'hidden', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    border: '1px solid #ddd'
                                }}>
                                    <img
                                        src={`data:image/jpeg;base64,${book.cover_image}`}
                                        alt={book.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </td>
                            <td>{book.title}</td>
                            <td>{book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description}</td>
                            <td>{getCategoryName(book.category_id)}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.publication_year}</td>
                            <td>{book.isbn}</td>
                            <td>{book.price}</td>
                            <td>{book.pages}</td>
                            <td>{book.quantity}</td>
                            <td>
                                <button className="btn btn-warning" onClick={() => handleUpdate(book)}>
                                    แก้ไข
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => confirmDeleteAction(book.book_id)}>ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog" style={{ marginTop: '10%', maxWidth: '500px' }}>
                    <div className="modal-content border border-primary">
                        <div className="modal-header">
                            <h5 className="modal-title">ยืนยันการลบ</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>คุณต้องการลบหรือไม่?</p>
                        </div>
                        <div className="modal-footer d-flex justify-content-end"> {/* ใช้ justify-content-end */}
                            <button type="button" className="btn btn-danger" onClick={handleDelete(selectedBook)}>
                                ยืนยัน
                            </button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowModal(false)}>
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default BooksManager;
