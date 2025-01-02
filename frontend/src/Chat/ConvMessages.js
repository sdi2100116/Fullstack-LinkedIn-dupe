import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import "./convMessages.css"

const ConvMessages = ({ selectedConversation }) => {
    const [messages, setMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const { user } = useContext(AuthContext);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
            const token = authTokens ? authTokens.access : null;

            if (!token) {
                setErrorMessage("User not authenticated");
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8000/chat/conversations/${selectedConversation.id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setErrorMessage('Error fetching messages');
            }
        };

        if (selectedConversation) {
            fetchMessages();
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message) {
            setErrorMessage('Message cannot be empty.');
            return;
        }

        try {
            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
            const token = authTokens ? authTokens.access : null;

            const response = await axios.post('http://127.0.0.1:8000/chat/messages/', 
            {
                conversation: selectedConversation.id,
                content: message
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const newMessage = response.data;

            // Update the messages state to include the new message
            setMessages(prevMessages => [...prevMessages, newMessage]);

            setMessage('');
            setErrorMessage('Message sent!');
        } catch (error) {
            setErrorMessage('Failed to send message.');
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className='Messages'>
            <h3 className='titleMessages'>Chat with {user.username === selectedConversation.user2.username ? selectedConversation.user1.username : selectedConversation.user2.username}</h3>
            <ul className='listMessages'>
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <li className='indMessages' key={message.id}>
                            <strong>{message.sender.username}</strong> 
                            <em>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</em>
                            <br /> 
                            {message.content}
                        </li>
                    ))
                ) : (
                    <p>No messages in this conversation.</p>
                )}
                <div ref={endOfMessagesRef} /> {/* This div helps in scrolling */}
            </ul>
            <div className='addMessages'>
                <form className='formMessage' onSubmit={handleSendMessage}>
                    <input className='inputMessage'
                        id="messageInput"
                        placeholder='Your message here...'
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className='buttonMessage' type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ConvMessages;
