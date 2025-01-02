import React, { useState } from 'react';
import axios from 'axios';
import './changeEmail.css';

const ChEmail = () => {
    // State hooks for input values
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [message, setMessage] = useState('');
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/changeemail/',
                {
                    current_email: currentEmail,
                    new_email: newEmail,
                    confirm_email: confirmEmail,
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
        <div className='chEmail'>
            <h2 className='chEmailTitle'>Change Your Email</h2>
            <form className='chEmailForm' onSubmit={handleSubmit}>
                <div>
                    <label className='chEmailLabel'>Current Email:</label>
                    <input
                        className='chEmailInput'
                        type="email"
                        id="current-email"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className='chEmailLabel'>New Email:</label>
                    <input
                        className='chEmailInput'
                        type="email"
                        id="new-email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className='chEmailLabel'>Confirm New Email:</label>
                    <input
                        className='chEmailInput'
                        type="email"
                        id="confirm-email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        required
                    />
                </div>
                <button 
                className='chEmailButton' type="submit">Change Email</button>
            </form>
            {message && <p className='chEmailMessage'>{message}</p>}
        </div>
    );
};

export default ChEmail;
