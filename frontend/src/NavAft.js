import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navAft.css'; 
import logo from './logo.png';

const NavBar2 = () => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(null); 

    useEffect(() => {
        
        const path = location.pathname.split('/').pop(); 
        setActiveTab(path || 'home'); 
    }, [location]);

    
    const renderContent = () => {
        if (activeTab === null) {
            return null; 
        }
        return (
            <nav className='navbar'>
                <div className='navbar-logo'>
                    <img src={logo} alt='e' className='logo-image' />
                </div>
                <ul className='navbar-menu'>
                    <li
                        className={`navbar-item ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => handleTabChange('home')}
                    >
                        Home
                    </li>
                    <li
                        className={`navbar-item ${activeTab === 'network' ? 'active' : ''}`}
                        onClick={() => handleTabChange('network')}
                    >
                        Network
                    </li>
                    <li
                        className={`navbar-item ${activeTab === 'Jobs' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Jobs')}
                    >
                        Jobs
                    </li>
                    <li
                        className={`navbar-item ${activeTab === 'discussions' ? 'active' : ''}`}
                        onClick={() => handleTabChange('discussions')}
                    >
                        Discussions
                    </li>
                    <li
                        className={`navbar-item ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => handleTabChange('notifications')}
                    >
                        Notifications
                    </li>
                    <li
                        className={`navbar-item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => handleTabChange('profile')}
                    >
                        Profile
                    </li>
                    <li
                        className={`navbar-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => handleTabChange('settings')}
                    >
                        Settings
                    </li>
                </ul>
            </nav>
        );
    };

    const handleTabChange = (tab) => {
        navigate(`/auth/${tab}`); 
        setActiveTab(tab);
    };

    return renderContent(); 
};

export default NavBar2;