import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';

const Books = () => {
    const [books, setBooks] = useState([
        // book_id,
        // title,
        // description,
        // category_id,
        // author_id,
        // publisher_id,
        // publication_year,
        // cover_image,
        // isbn,
        // pages,
        // price,
        // quantity,
        // date_added
    ]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const response = await axios.get('http://localhost:5000/api/books', {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        });
        setBooks(response.data);
    };
    
    return (
        <div className="container mt-5">
            <div className="container mt-5">
                <div className="row">
                    {books.map((book) => (
                        <div className="col-md-4" key={book.id}>
                        <BookCard book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Books;
