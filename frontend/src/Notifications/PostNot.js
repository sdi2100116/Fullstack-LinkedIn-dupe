import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './postNot.css'; // Ensure this file exists and has the necessary styles

const PNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens ? authTokens.access : null;

    useEffect(() => {
        if (!token) {
            console.error("Token is missing! Cannot make the request.");
            setError("Token is missing!");
            setLoading(false);
            return;
        }

        console.log("Making GET request with token:", token);

        axios.get('http://127.0.0.1:8000/notifications/postnotifications/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('API Response:', response.data); // Log the response data
            setNotifications(response.data.results);
        })
        .catch(error => console.error('Error fetching notifications:', error));
    }, [token]);

    const handleDelete = (notificationId) => {
        axios.delete(`http://127.0.0.1:8000/notifications/postnotificationsdel/${notificationId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        })
        .catch(error => {
            console.error('Error deleting notification:', error);
            setError('Error deleting notification.');
        });
    };

    return (
        <div className='pnotifications'>
            <h2 className='pnotificationsTitle'>Post Notifications</h2>
            {error ? (
                <p className='errorText'>{error}</p>
            ) : (
                <ul className='pnotificationsList'>
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <li key={notification.id}>
                                <p className='pnotificationsText'>{notification.message}</p>
                                <button className='pnotificationsDelete' onClick={() => handleDelete(notification.id)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <p className='pnotificationsnoText'>No notifications.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default PNotifications;