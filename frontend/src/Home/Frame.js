import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './frame.css';

const swal = require('sweetalert2')

const Frame = () => {

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [video, setVideo] = useState(null);
    const { user } = useContext(AuthContext);


    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const token = authTokens ? authTokens.access : null;

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!token) {
            alert("You must be logged in to create a post.");
            return;
        }

        

        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        if (image) formData.append('image', image);
        if (audio) formData.append('audio', audio);
        if (video) formData.append('video', video);

        try {
            await axios.post('http://127.0.0.1:8000/blogs/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });


            // Reset state variables
            setTitle('');
            setBody('');
            setImage(null);
            setAudio(null);
            setVideo(null);

            // Reset file inputs
            document.querySelector('input[type="file"]').value = '';
            document.querySelector('input[type="file"][accept="audio/*"]').value = '';
            document.querySelector('input[type="file"][accept="video/*"]').value = '';

            swal.fire({
                title: "Post Created",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } catch (error) {
            console.error("Error creating post:", error);
            swal.fire({
                title: "Failed to create post",
                icon: "error",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    };

    return (
        <div>
            <div className='wmsg'>
                <p>Welcome back,{user.username}!</p>
            </div>
            <div className='post'>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    <textarea 
                        placeholder="What's on your mind?" 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} 
                    />
                    <div className='file-inputs'>
                        <label className={`file-label ${image ? 'uploaded' : ''}`}>
                            <i className="fas fa-image"></i>
                            <span className='file-text'>Upload an Image</span>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </label>
                        <label className={`file-label ${audio ? 'uploaded' : ''}`}>
                            <i className="fas fa-microphone"></i>
                            <span className='file-text'>Upload Sound</span>
                            <input 
                                type="file" 
                                accept="audio/*"
                                onChange={(e) => setAudio(e.target.files[0])} 
                            />
                        </label>
                        <label className={`file-label ${video ? 'uploaded' : ''}`}>
                            <i className="fas fa-video"></i>
                            <span className='file-text'>Upload a Video</span>
                            <input 
                                type="file" 
                                accept="video/*"
                                onChange={(e) => setVideo(e.target.files[0])} 
                            />
                        </label>
                    </div>
                    <button type="submit">Create Post</button>
                </form>
            </div>
        </div>
    );

};

export default Frame;