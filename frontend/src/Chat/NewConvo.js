import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./newConvo.css"
const NewConversation = ({ currentUserId, onConversationCreated }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [conversation, setConversation] = useState(null);
    const [message, setMessage] = useState('');
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(null);

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

    const handleStartConversation = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!selectedUserId) {
            setErrorMessage('Please select a user to start a conversation.');
            return;
        }

        try {
            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
            const token = authTokens ? authTokens.access : null;

            const response = await axios.post('http://127.0.0.1:8000/chat/conversationsstart/', 
            {
                user2: selectedUserId
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data && response.data.conversation) {
                setConversation(response.data.conversation);
                setShowMessageBox(true);
            } else {
                setErrorMessage('Unexpected response format.');
            }
        } catch (error) {
            console.error('Error starting conversation:', error.response || error);
            setErrorMessage('Failed to start conversation.');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message) {
            setErrorMessage('Message cannot be empty.');
            return;
        }

        try {
            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
            const token = authTokens ? authTokens.access : null;

            await axios.post('http://127.0.0.1:8000/chat/messages/', 
            {
                conversation: conversation.id,
                content: message
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setMessage('');
            setErrorMessage('Message sent!');
            window.location.reload();
        } catch (error) {
            setErrorMessage('Failed to send message.');
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className='Newconvo'>
            <div className='NewconvoContainer'>
                <div className='NewconvoLeft'>
                    <h3 className='titleNewconvo'>Start a New Chat</h3>
                    <form className='formNewconvo' onSubmit={handleStartConversation}>
                        <select className='selectNewconvo'
                            id="userSelect"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">Select a User</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                        <button className='buttonNewConvo' type="submit">Start Conversation</button>
                    </form>
                </div>
                {showMessageBox && (
                    <div className='NewconvoRight'>
                        <form className='formNewmess' onSubmit={handleSendMessage}>
                            <input className='inputNewmess'
                                id="messageInput"
                                placeholder='Your message here...'
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button className='buttonNewmess' type="submit">Send Message</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default NewConversation;
