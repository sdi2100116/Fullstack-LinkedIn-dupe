import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import "./logoutButton.css"
const LogoutButton = () => {
    const { logoutUser } = useContext(AuthContext)  

    const handleLogout = () => {
        logoutUser();  
    };

    return (
        <div className='logout'>
        <button className='logoutButton' onClick={handleLogout}>
            Logout
        </button>
        </div>
    );
};

export default LogoutButton;