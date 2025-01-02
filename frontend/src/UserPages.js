  import React, { useState, useEffect, useContext } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import AuthContext from './context/AuthContext';
  import axios from "axios";
  import './userPages.css';

  function UserPage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [conversation,setConversation]=useState(null);
    const { luser } = useContext(AuthContext);
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;

    useEffect(() => {
      axios
        .get(`http://127.0.0.1:8000/api/profile/${username}/`) 
        .then((response) => {
          console.log('API Response:', response.data);
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }, [username]);

    const [status, setStatus] = useState('loading');

    useEffect(() => {
      if (!token) {
        setStatus('error');
        return;
      }
      axios.get(`http://127.0.0.1:8000/api/connectionsstatus/${username}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => setStatus(response.data.connection_status))
      .catch(() => setStatus('error'));
    }, [username]);

    const handleButtonClick = () => {
      if (status === 'not_connected' || status === 'rejected') {
        axios.post(`http://127.0.0.1:8000/api/sendrequest/${username}/`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          setStatus('pending'); 
        })

        .catch(() => setStatus('error'));
      }
    };


    const handleSendMessage = async (e) => {
      e.preventDefault();
      setErrorMessage('');

      if (!user) {
          return;
      }

      try {
          const authTokens = JSON.parse(localStorage.getItem("authTokens"));
          const token = authTokens ? authTokens.access : null;

          // Start the conversation
          const conversationResponse = await axios.post(
              'http://127.0.0.1:8000/chat/conversationsstart/', 
              { user2: user.id }, 
              {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                  }
              }
          );

          const conversation = conversationResponse.data.conversation;

          if (!conversation) {
              setErrorMessage('Unexpected response format.');
              return;
          }

          // Now send the message in the conversation
          if (!message) {
              setErrorMessage('Message cannot be empty.');
              return;
          }

          await axios.post(
              'http://127.0.0.1:8000/chat/messages/', 
              {
                  conversation: conversation.id,
                  content: message
              }, 
              {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                  }
              }
          );

          setMessage('');
          setErrorMessage('Message sent!');
          navigate('/auth/discussions');
      } catch (error) {
          console.error('Error:', error.response || error);
          setErrorMessage('Failed to start conversation or send message.');
      }
  };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const getButtonText = () => {
      switch (status) {
        case 'accepted':
          return 'Connected';
        case 'pending':
          return 'Pending';
        case 'not_connected':
        case 'rejected':
          return 'Connect';
        case 'loading':
          return 'Loading...';
        case 'error':
          return 'Error';
        default:
          return 'Connect';
      }
    };

    const getButtonClass = () => {
      switch (status) {
        case 'accepted':
          return 'connectedButtonProfile';
        case 'pending':
          return 'pendingButtonProfile';
        case 'not_connected':
        case 'rejected':
          return 'connectButtonProfile';
        case 'loading':
          return 'Loading...';
        case 'error':
          return 'Error';
        default:
          return 'connectButtonProfile';
      }
    };

    const filteredSkills = user.skills.filter(skill => 
      status === 'accepted' || skill.is_public
    );

    const filteredEd = user.education.filter(education => 
      status === 'accepted' || education.is_public
    );

    const filteredExp = user.experience.filter(experience => 
      status === 'accepted' || experience.is_public
    );

    return (
      <div className="userProfile">
        <h1 className="usernameProfile">@{user.username}</h1>
        <img src={user.photo} alt="Profile" />
        <button className={getButtonClass()} onClick={handleButtonClick}>
          {getButtonText()}
        </button>
        {status === 'accepted' && (
          <>
            <button className="messageProfile" onClick={() => setShowMessageInput(!showMessageInput)}>
            <i class="fa-solid fa-message"></i>
            </button>
            {showMessageInput && (
              <form className="messageformProfile" onSubmit={handleSendMessage}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  cols="50"
                  placeholder="Type your message here..."
                />
                <button type="submit">Send</button>
                {errorMessage && <p>{errorMessage}</p>}
              </form>
            )}
          </>
        )}
                <div className={showMessageInput ? "bioProfile1" : "bioProfile2"}>
                  <h4>About me</h4>
                  <p>{user.bio}</p>
        </div>
        <div className="profileSections">
          <div className="profileSection skillsProfile">
            <h2>Skills</h2>
            {filteredSkills.map(skill => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </div>
          <div className="profileSection educationProfile">
            <h2>Education</h2>
            {filteredEd.map(education => (
              <li key={education.id}>
                <strong>{education.school}</strong><br />
                {education.degree}<br />
                <div>
                  {new Date(education.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })} -
                  {new Date(education.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </li>
            ))}
          </div>
          <div className="profileSection experienceProfile">
            <h2>Experience</h2>
            {filteredExp.map(experience => (
              <li key={experience.id}>
                <strong>{experience.work_name}</strong><br />
                {experience.job}<br />
                <div>
                  {new Date(experience.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })} -
                  {new Date(experience.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </li>
            ))}
          </div>
        </div>
      </div>
    );
  }

  export default UserPage;
