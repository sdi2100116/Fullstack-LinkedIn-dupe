import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ConvMessages from './ConvMessages'; // Import the ConversationView component
import AuthContext from '../context/AuthContext';
import "./conversations.css"


const UserConversations = ({ currentUserId }) => {
    const [conversations, setConversations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null); // State for selected conversation
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchConversations = async () => {
            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
            const token = authTokens ? authTokens.access : null;

            if (!token) {
                setErrorMessage("User not authenticated");
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8000/chat/conversations/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                setConversations(response.data);
                if (response.data.length > 0) {
                    setSelectedConversation(response.data[0]); 
                }
                
            } catch (error) {
                console.error('Error fetching conversations:', error);
                setErrorMessage('Error fetching conversations');
            }
        };

        fetchConversations();
    }, []);

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
    };

    return (
        <div className='ConvosMess'>
            <div className='Convos'>
                <h3 className='titleConvos'>Your Conversations</h3>
                {conversations.length === 0 ? (
                    <p className='noConvos'>No conversations found.</p>
                ) : (
                    <ul className='listConvos'>
                        {conversations.map(convo => (
                            <li className='indConvos' key={convo.id} onClick={() => handleConversationClick(convo)} >
                                {user.username === convo.user2.username ? convo.user1.username : convo.user2.username}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='barConv'>
            </div>
            <div className='Mess' >
                {selectedConversation && <ConvMessages selectedConversation={selectedConversation} />}
            </div>
            
        </div>
        
    );
};

export default UserConversations;
