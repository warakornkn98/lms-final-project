import React, { useEffect, useState } from 'react';
import { isRouteErrorResponse, useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS ที่กำหนดเอง
import { AuthData } from './AuthContext';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
          navigate('/admin');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/login', { username, password });
          localStorage.setItem('token', response.data.token);
          navigate('/admin');
        } catch (err) {
          setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Welcome</h2>
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
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
