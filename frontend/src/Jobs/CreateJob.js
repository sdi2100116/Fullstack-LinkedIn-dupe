import React, { useState } from 'react';
import axios from 'axios';
import './createJob.css'

const CreateJob = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null)

    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;

    const handleSubmit = (e) => {
        e.preventDefault();


        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('company', company);
        formData.append('location', location);
        formData.append('skills',skills);
        if (image) {
            formData.append('image', image); 
        }
        
        axios.post('http://127.0.0.1:8000/jobs/', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',  
            }
        })
        .then(response => {
            console.log('Job created:', response.data);
            
        })
        .catch(error => console.error('Error creating job:', error));
    };

    return (
        <div className='createJob'>
    <h2>Create Job</h2>
    <form onSubmit={handleSubmit}>
        <div className="form-row">
            {/* First column */}
            <div className="form-col">
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Company:
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
                </label>
            </div>

            {/* Second column */}
            <div className="form-col">
                <label>
                    Location:
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </label>
                <label>
                    Skills:
                    <input type="text" placeholder='Please use comma..' value={skills} onChange={(e) => setSkills(e.target.value)} />
                </label>
            </div>
        </div>
        
        <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        {/* Image Upload Input */}
        <label className={`file-label ${image ? 'uploaded' : ''}`}>
            <i className="fas fa-image"></i>
            <span className='file-text'>Corporation logo</span>
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files[0])} 
            />
        </label>
        <br />
        <button type="submit">Create Job</button>
    </form>
</div>
    );
};

export default CreateJob;