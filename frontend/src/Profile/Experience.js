import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './experience.css'

const swal = require('sweetalert2')
const Experience = () => {
    const [workName, setWorkName] = useState('');
    const [job, setJob] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const togglePublic = () => {
        setIsPublic(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authTokens = JSON.parse(localStorage.getItem("authTokens"));
        const token = authTokens ? authTokens.access : null;

        
        if (!token) {
            alert("You must be logged in to create a post.");
            return;
        }


        const formData = new FormData();
        formData.append('work_name', workName);
        formData.append('job', job); 
        formData.append('start_date', startDate);
        if (endDate) formData.append('end_date', endDate);
        formData.append('is_public', isPublic ? 'true' : 'false');

        
        try {
            await axios.post('http://127.0.0.1:8000/personaldata/experience/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });


            // Reset state variables
            setWorkName('');
            setJob('');
            setStartDate('');
            setEndDate('');
            setIsPublic(false);


            swal.fire({
                title: "Experience Added to your Profile",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } catch (error) {
            console.error("Error adding experience:", error);
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
    
    return(
        <div className='experience'>
        <p className='experienceTitle'>Add experience to your profile!</p>
        <form className='experienceForm' onSubmit={handleSubmit}>
                <label className='experienceLabel'>Company/Organization:</label>
                <input type="text"
                placeholder="Work Name"
                value={workName} 
                onChange={(e) => setWorkName(e.target.value)} />
                <label className='experienceLabel'>Occupation:</label>
                <input type="text"
                placeholder="What were you doing?"
                value={job} 
                onChange={(e) => setJob(e.target.value)} />
                <label className='experienceLabel'>Start Date:</label>
                <input type="date"
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} />
                <label className='experienceLabel'>End Date:</label>
                <input type="date"
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} />

                <button
                    type="button"
                    onClick={togglePublic}
                    className={isPublic ? 'publicButton' : 'privateButton'}
                >
                {isPublic ? <><i class="fa-solid fa-unlock" /> Public</>  : <><i className="fa-solid fa-lock" /> Private</>}
                </button>
                <button type="submit">Add experience</button>
        </form>
        </div>       
            
    );
     
};
export default Experience