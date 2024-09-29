import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';

const Books = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/books', {
                headers: { authtoken: `${localStorage.getItem('token')}` }
            });
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            alert('Unable to fetch books. Please try again later.');
        }
    };
    
    
    return (
        <div className="container mt-5">
            <div className="container mt-5" >
                <div className="row">
                    {books.map((book) => (
                        <div className="col-md-4" key={book.book_id}>
                        <BookCard book={book} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Books;
