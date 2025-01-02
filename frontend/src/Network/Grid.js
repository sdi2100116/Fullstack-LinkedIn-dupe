import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";    
import './grid.css';

const Grid = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authTokens = JSON.parse(localStorage.getItem("authTokens"));
        const token = authTokens ? authTokens.access : null;

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/connectionsWuser/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUsers(data); 
                
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (users.length === 0) return <p className='noConnections'>No connections yet.</p>; // Handle case of no users

    return (
        <div>
            <h2 className='gridTitle'>Your Network</h2>
            
            <div className="grid">
                {users.map(user => (
                    <Link to={`/auth/profile/${user.username}`} className='gridUser' key={user.username}>
                        <img src={user.photo} alt={user.username} className="gridUserImage" />
                        <h3 className="gridUsername">@{user.username}</h3>
                        {user.experience.length > 0 ? (
                            <p className="gridJob">{user.experience[0].job}</p>
                        ) : (
                            <p className="gridJob">No experience info available</p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Grid;
