import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './skill.css'

const swal = require('sweetalert2')
const Skill = () => {
    const [skillName, setSkillName] = useState('');
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
        formData.append('name', skillName);
        formData.append('is_public', isPublic ? 'true' : 'false');

        
        try {
            await axios.post('http://127.0.0.1:8000/personaldata/skills/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });


            // Reset state variables
            setSkillName('');
            setIsPublic(false);


            swal.fire({
                title: "Skill Added to your Profile",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } catch (error) {
            console.error("Error adding skill:", error);
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
        <div className='skill'>
        <p className='skillTitle'>Add a Skill to your Profile!</p>
        <form className='skillForm' onSubmit={handleSubmit}>
                <label className='skillLabel'>Skill Name:</label>
                <input type="text"
                placeholder="Skill name"
                value={skillName} 
                onChange={(e) => setSkillName(e.target.value)} />


                <button
                    type="button"
                    onClick={togglePublic}
                    className={isPublic ? 'publicButton' : 'privateButton'}
                >
                {isPublic ? <><i class="fa-solid fa-unlock" /> Public</>  : <><i className="fa-solid fa-lock" /> Private</>}
                </button>

                <button type="submit">Add skill</button>
        </form>
        </div>       
            
    );
     
};
export default Skill