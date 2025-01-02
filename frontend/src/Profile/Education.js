import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './education.css'

const swal = require('sweetalert2')
const Education = () => {
    const [schoolName, setSchoolName] = useState('');
    const [degree, setDegree] = useState('');
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
        formData.append('school', schoolName);
        formData.append('degree', degree); 
        formData.append('start_date', startDate);
        if (endDate) formData.append('end_date', endDate);
        formData.append('is_public', isPublic ? 'true' : 'false');

        
        try {
            await axios.post('http://127.0.0.1:8000/personaldata/education/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });


            // Reset state variables
            setSchoolName('');
            setDegree('');
            setStartDate('');
            setEndDate('');
            setIsPublic(false);


            swal.fire({
                title: "Education Added to your Profile",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } catch (error) {
            console.error("Error adding education:", error);
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
        <div className='education'>
        <p className='educationTitle'>Add education to your profile!</p>
        <form className='educationForm' onSubmit={handleSubmit}>
                <label className='educationLabel'>School:</label>
                <input type="text"
                placeholder="School Name"
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)} />
                <label className='educationLabel'>Degree:</label>
                <input type="text"
                placeholder="BSc/Masters..."
                value={degree} 
                onChange={(e) => setDegree(e.target.value)} />
                <label className='educationLabel'>Start Date:</label>
                <input type="date"
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} />
                <label className='educationLabel'>End Date:</label>
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
                <button type="submit">Add education</button>
        </form>
        </div>       
            
    );
     
};
export default Education