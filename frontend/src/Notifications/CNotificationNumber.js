import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios'; 
import './cNotificationNumber.css'


const CNotificationNumber = () => {
    const [number, setNumber] = useState(null);

    useEffect(() => {
        const authTokens = JSON.parse(localStorage.getItem("authTokens"));
        const token = authTokens ? authTokens.access : null;
    
        if (!token) return;
    
        axios.get('http://127.0.0.1:8000/notifications/getnotnumber/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setNumber(response.data.number_of_notifications);
        })
        .catch(error => console.error("Error fetching connection number:", error));
    }, []);

    return (
        <div className="cnotificationNumber">
            <p>{number}</p>
        </div>
    );
};

export default CNotificationNumber;