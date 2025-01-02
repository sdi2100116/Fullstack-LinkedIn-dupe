import React, { useState, useEffect, useContext } from "react";
import AuthContext from '../context/AuthContext';
import axios from "axios";
import './profile.css';  // Import the CSS file
import Experience from "./Experience";
import Education from "./Education";
import Skill from "./Skill";

function Profile() {
  const [profile, setProfile] = useState('');
  const [newBio, setNewBio] = useState('');  // State for new bio
  const [isEditing, setIsEditing] = useState(false);  // State to track editing mode
  const { user } = useContext(AuthContext);
  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const token = authTokens ? authTokens.access : null;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/profile/${user.username}/`)
      .then((response) => {
        console.log('API Response:', response.data);
        setProfile(response.data);
        setNewBio(response.data.bio || ''); // Set initial newBio to current bio or empty string
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, [user.username]);

  const handleBioChange = (event) => {
    setNewBio(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`http://127.0.0.1:8000/api/profile/${user.username}/bio/`, {
        bio: newBio,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setProfile(prevProfile => ({
        ...prevProfile,
        bio: newBio
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  return (
    <div className="myuserProfile">
      <h1 className="myusernameProfile">@{profile.username}</h1>
      <img src={profile.photo} alt="Profile" />

      <div className="frameProfile"> 
        <p><strong>First name:</strong>{profile.first_name}</p>
        <p><strong>Last name:</strong>{profile.last_name}</p>
        <p><strong>Phone Number:</strong>{profile.phone_number}</p>
        <p><strong>E-mail:</strong>{profile.email}</p>

      </div>
      <p className="myuserTitle">About me</p>
      <form className="myuserForm" onSubmit={handleSubmit}>
        {isEditing ? (
          <input
            type="text"
            id="bio"
            value={newBio}
            onChange={handleBioChange}
            placeholder="Update your bio"
          />
        ) : (
          <p onClick={() => setIsEditing(true)}>
            {profile.bio || 'No bio available. Click to add a bio.'}
          </p>
        )}
        {isEditing && <button type="submit">Update Bio</button>}
      </form>

      <div className="otherComponents">
        <Education />
        <Experience />
        <Skill />
      </div>
    </div>
  );
}

export default Profile;
