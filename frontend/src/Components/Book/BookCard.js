import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function BookCard({book}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/books/${book.book_id}`, { state: { book } });
    };

    return (
        <div>
        <div className="card mb-3" style={{ width: "18rem" }}>
        <img
            src={`data:image/jpeg;base64,${book.cover_image}`}
            className="card-img-top"
            alt={book.title}
            style={{ width: 'auto', height: 'auto' }}
        />
        <div className="card-body">
            <h5 className="card-title">{book.name}</h5>
            <p className="card-text">ผู้แต่ง: {book.author}</p>
            <p className="card-text">ประเภท: {book.booktype}</p>
            <p className="card-text">ราคา: {book.price} บาท</p>
            <p className="card-text">ปีที่พิมพ์: {book.publish_year}</p>
            <button className="btn btn-primary" onClick={handleClick}>ดูรายละเอียด</button>
            {/* <Link to={`/books/${book.id}`} className="btn btn-primary">
            ดูรายละเอียด
            </Link> */}
        </div>
        </div>
        </div>
    )
}

export default BookCard
