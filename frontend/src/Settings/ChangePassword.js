import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './changePassword.css'


const ChPass = () => {
    // State hooks for input values
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            

            const response = await axios.post('http://127.0.0.1:8000/api/changepass/',
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.error);
            } else {
                setMessage('An error occurred.');
            }
        }
    
    };

    return (
        <div className='chPass'>
            <h2 className='chPassTitle'>Change Your Password</h2>
            <form className='chPassForm' onSubmit={handleSubmit}>
                <div>
                    <label className='chPassLabel'>Current Password:</label>
                    <input className='chPassInput'
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className='chPassLabel'>New Password:</label>
                    <input
                        className='chPassInput'
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className='chPassLabel'>Confirm New Password:</label>
                    <input
                        className='chPassInput'
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button 
                className='chPassButton' type="submit">Change Password</button>
                {message && <p className='chEmailMessage'>{message}</p>}
            </form>
        </div>
    );
};

export default ChPass;