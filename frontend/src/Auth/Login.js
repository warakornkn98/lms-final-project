import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import custom CSS
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Set initial values for username and password to empty strings
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/login', { username, password });
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } catch (err) {
          setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">เข้าสู่ระบบ</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">เข้าสู่ระบบ</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
