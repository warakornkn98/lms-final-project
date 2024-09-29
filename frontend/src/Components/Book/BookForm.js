import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const BookForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    
    const { categories = [], initialBook } = location.state || {};
    console.log('Received location state:', location.state);

    const [showModal, setShowModal] = useState(false);
    const [submitEvent, setSubmitEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: 0,
        author: '',
        publisher: '',
        publication_year: '',
        isbn: '',
        cover_image: '',
        pages: '',
        price: '',
        quantity: '',
        ...initialBook 
    });

    

    useEffect(() => {
        if (initialBook) {
            setFormData(initialBook);
            console.log(initialBook);
            
        }
    }, [initialBook]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                cover_image: file,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const confirmAction = (e) => {
        e.preventDefault();
        setSubmitEvent(e); // store event
        setShowModal(true); // open modal
    };

    const handleConfirm = async () => {
        setShowModal(false); // close modal

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            if (initialBook) {
                await axios.put(`http://localhost:5000/api/books/${initialBook.book_id}`, formDataToSend, {
                    headers: {
                        'authtoken': localStorage.getItem('token'),
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/books', formDataToSend, {
                    headers: {
                        'authtoken': localStorage.getItem('token'),
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            navigate("/admin/booktable");
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center mb-4">{initialBook ? "ฟอร์มแก้ไขข้อมูลหนังสือ" : "ฟอร์มเพิ่มข้อมูลหนังสือ"}</h2>
            <form onSubmit={confirmAction} className="bg-light p-4 rounded">

                <div className="row mt-2 ">
                    <div className="col-md-6">
                        <label htmlFor="title" className="form-label">ชื่อหนังสือ</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        
                        <label htmlFor="description" className="form-label mt-3">คำอธิบาย</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ height: '120px' }}
                            required
                        />

                    </div>

                    <div className="col-md-6 text-center ">
                        <div
                            style={{
                                width: '150px',
                                height: '150px',
                                border: '10px solid #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '50px',
                                backgroundColor: '#f8f9fa',
                            }}
                        >
                            {formData.cover_image ? (
                                formData.cover_image instanceof File ? (
                                    <img
                                        src={URL.createObjectURL(formData.cover_image)}
                                        alt={formData.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    typeof formData.cover_image === 'string' ? (
                                        <img
                                            src={`data:image/jpeg;base64,${formData.cover_image}`}
                                            alt={formData.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <img
                                            src="/path/to/placeholder-image.png"
                                            alt="No cover"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    )
                                )
                            ) : (
                                <img
                                    src="/path/to/placeholder-image.png"
                                    alt="No cover"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            )}
                        </div>


                        <input
                            type="file"
                            className="form-control"
                            id="cover_image"
                            name="cover_image"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                </div>


                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="row mb-3">
                        <div className="col-md-12">
                        <label htmlFor="category_id" className="form-label mt-3">หมวดหมู่หนังสือ</label>
                        <select
                            className="form-control"  // เปลี่ยนจาก form-select เป็น form-control
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                {category.name}
                                </option>
                            ))
                            ) : (
                            <option value="">No categories available</option>
                            )}
                        </select>
                        </div>
                        
                        <div className="col-md-12">
                            <label htmlFor="author" className="form-label mt-3">ผู้แต่ง</label>
                            <input
                                type="text"
                                className="form-control"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-12">
                            <label htmlFor="publisher" className="form-label mt-3">สำนักพิมพ์</label>
                            <input
                                type="text"
                                className="form-control"
                                id="publisher"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                            />
                        </div>

                       
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row mb-3">
                            <div className="col-md-12">
                            <label htmlFor="isbn" className="form-label mt-3">ISBN</label>
                            <input
                                type="text"
                                className="form-control"
                                id="isbn"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                maxLength="13"
                            />
                            </div>
                            <div className="col-md-12">
                            <label htmlFor="publication_year" className="form-label mt-3">ปีที่พิมพ์</label>
                            <input
                                type="number"
                                className="form-control"
                                id="publication_year"
                                name="publication_year"
                                value={formData.publication_year}
                                onChange={handleChange}
                                required
                            />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="pages" className="form-label mt-3">จำนวนหน้า</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="pages"
                                    name="pages"
                                    value={formData.pages}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="price" className="form-label mt-3">ราคา</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>{ !initialBook?
                                <div className="col-md-4 ">
                                <label htmlFor="quantity" className="form-label mt-3">จำนวนเล่ม</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                                </div>
                                : null
                            }
                            
                        </div>
                    </div>
                </div>

                <div className="row mb-3 justify-content-center">
                    <div className="col-md-4 text-center">
                        <button type="submit" className="btn btn-primary w-100">
                            {initialBook ? "อัปเดต" : "เพิ่ม"}
                        </button>
                    </div>
                </div>
            </form>


            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog" style={{ marginTop: '10%', maxWidth: '500px' }}>
                    <div className="modal-content border border-primary"> {/* เพิ่มสีขอบ */}
                        <div className="modal-header">
                            <h5 className="modal-title">ยืนยันการทำงาน</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>คุณต้องการ {initialBook ? "update" : "add"} หรือไม่?</p>
                        </div>
                        <div className="modal-footer d-flex justify-content-end"> {/* จัดเรียงปุ่มไปทางขวา */}
                            <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>ยกเลิก</button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirm}>ยืนยัน</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>




    );
};

export default BookForm;
