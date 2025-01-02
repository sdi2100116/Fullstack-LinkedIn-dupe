import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate after deletion
import "./deleteProfile.css"

const DeleteProfile = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // To redirect user after deletion

    const handleDeleteProfile = async () => {
        const confirmation = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
        if (!confirmation) {
            return; // If user cancels, stop further execution
        }

        const authTokens = JSON.parse(localStorage.getItem("authTokens"));
        const token = authTokens ? authTokens.access : null;

        if (!token) {
            setErrorMessage('You must be logged in to delete your profile.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/delete-profile/', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                setSuccessMessage('Your profile has been successfully deleted.');
                localStorage.removeItem("authTokens"); // Remove tokens from localStorage
                setTimeout(() => {
                    navigate('/'); // Redirect user to the homepage or login page
                }, 2000); // Wait 2 seconds before redirecting
            }
        } catch (error) {
            setErrorMessage('Error deleting profile.');
            console.error('Error:', error);
        }
    };

    return (
        <div className='deleteProfile'>
            <button onClick={handleDeleteProfile} className="deleteProfileButton">
                Delete My Profile
            </button>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default DeleteProfile;
