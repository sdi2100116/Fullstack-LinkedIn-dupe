import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './connectionNot.css'


const CNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens ? authTokens.access : null;

    useEffect(() => {
        if (!token) return;

        axios.get('http://127.0.0.1:8000/notifications/connectionnotifications/', {
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

    const handleResponse = (notificationId, accepted) => {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        const token = authTokens ? authTokens.access : null;

        axios.patch(`http://127.0.0.1:8000/notifications/connectionnotificationsacc/${notificationId}/`, 
            { answer: accepted },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        .then(() => {
            
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        })
        .catch(error => console.error('Error updating notification:', error));
    };

    return (
        <div className='cnotifications'>
            <h2 className='cnotificationsTitle'>Network Notifications</h2>
            <ul className='cnotificationsList'>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <li key={notification.id}>
                            <p className='cnotificationsText'>{notification.connection.from_user.username} wanted to connect with you!</p>
                            {notification.answer === null && (
                                <div className='cnotificationsAcceptReject'>
                                    <button className='cnotificationsAccept' onClick={() => handleResponse(notification.id, true)}>Accept</button>
                                    <button className='cnotificationsReject' onClick={() => handleResponse(notification.id, false)}>Reject</button>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <p className='cnotificationsnoText'>No notifications.</p>
                )}
            </ul>
        </div>
    );
};

export default CNotifications;