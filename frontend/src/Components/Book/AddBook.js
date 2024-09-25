import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const AddBook = () => {
    const [category, setCategory] = useState([]);
    const [author, setAuthor] = useState([]);
    const [publisher, setPublisher] = useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        coverImage: '',
        description: '',
        isbn: '',
        category_id: 0,
        author_id: 0,
        publisher_id: 0,
        publication_year: 0,
        pages: 0,
        price: 0.00,
        quantity: 0,
        
      });

    useEffect(() => {
        fetchCategory();
        fetchAuthor();
        fetchPublisher();
    }, []);

    const fetchCategory = async () => {
        const response = await axios.get("http://localhost:5000/api/category", {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        })
        setCategory(response.data);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              coverImage: reader.result // Base64 image
            });
          };
          reader.readAsDataURL(file); // Convert file to Base64
        }
      };


    // const { name,desc,booktype_id,author_id,publisher_id,publish_year,price,total_quantity,available_quantity} = book;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'isbn' && value.length > 13) return;
        if (name === 'publicationYear' && value.length > 4) return;
    
        setFormData({
          ...formData,
          [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/books',  formData , {
            headers: { authtoken: `${localStorage.getItem('token')}` }
        });
        navigate("/admin/books");
    };

    return (
        <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="genre" className="form-label">Genre</label>
          <input
            type="text"
            className="form-control"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="publisher" className="form-label">Publisher</label>
          <input
            type="text"
            className="form-control"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="publicationYear" className="form-label">Publication Year</label>
          <input
            type="number"
            className="form-control"
            id="publicationYear"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pages" className="form-label">Pages</label>
          <input
            type="number"
            className="form-control"
            id="pages"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="isbn" className="form-label">ISBN</label>
          <input
            type="text"
            className="form-control"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">Cover Image</label>
          <input
            type="file"
            className="form-control"
            id="coverImage"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
    </div>
    );
};

export default AddBook;
