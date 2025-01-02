import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './leftPart.css';

const LeftFrame = () => {
    const { user } = useContext(AuthContext);
    const [number, setNumber] = useState(null);

    useEffect(() => {
        const authTokens = JSON.parse(localStorage.getItem("authTokens"));
        const token = authTokens ? authTokens.access : null;
    
        if (!token) return;
    
        axios.get('http://127.0.0.1:8000/api/connectionsnumber/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setNumber(response.data.number_of_connections);
        })
        .catch(error => console.error("Error fetching connection number:", error));
    }, []);

    return (
        <div className="user-profile-box">
            <h2>&emsp;&nbsp;Personal Details</h2>
            <div className="user-details">
                <p><strong>&emsp;&emsp;Username:</strong> {user.username}</p>
                <p><strong>&emsp;&emsp;Name:</strong> {user.name}</p>
                <p><strong>&emsp;&emsp;Last Name:</strong> {user.last_name}</p>
                <p><strong>&emsp;&emsp;Email:</strong> {user.email}</p>
                <p><strong>&emsp;&emsp;Phone:</strong> {user.phone_number}</p>
            </div>
            <h2>&emsp;&nbsp;My Network</h2>
            <div className="user-details">
                <p><strong>&emsp;&emsp;Connections:</strong> {number !== null ? number : "Loading..."}</p>
                <Link className="user-link" to={`../auth/network/`}>Manage your network</Link>
            </div>
        </div>
    );
};

export default LeftFrame;