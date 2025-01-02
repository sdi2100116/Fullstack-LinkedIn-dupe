import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './jobList.css';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [showApplicants, setShowApplicants] = useState(false);
    const [userSkills, setUserSkills] = useState([]);
    const { user } = useContext(AuthContext);
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;
    
    const [offset, setOffset] = useState(0);
    const [limit] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserSkills = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/profile/${user.username}/`);
                    setUserSkills(response.data.skills.map(skill => skill.name));
                } catch (error) {
                    console.error('Error fetching user skills:', error);
                }
            }
        };

        fetchUserSkills();
    }, [user]);

    useEffect(() => {
        const fetchJobs = async () => {
            if (!hasMore || loadingMore) return; 

            setLoadingMore(true);  

            try {
                const response = await axios.get(`http://127.0.0.1:8000/jobs/?limit=${limit}&offset=${offset}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const newJobs = response.data.results || [];
                setJobs(prevJobs => {
                    const filteredJobs = newJobs.filter(job => !prevJobs.some(prevJob => prevJob.id === job.id));
                    return [...prevJobs, ...filteredJobs];  
                });
                setHasMore(response.data.next !== null); 
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError(error);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchJobs();
    }, [token, offset, hasMore]); 

    // Scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
                if (!loadingMore && hasMore) {
                    setOffset(prevOffset => prevOffset + limit);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore]);

    const handleApply = async (jobId) => {
        try {
            await axios.post(`http://127.0.0.1:8000/jobs/${jobId}/apply/`, {
                job: jobId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            alert('Application submitted successfully!');
        } catch (error) {
            console.error('Error applying for job:', error);
            alert('Error applying for job. Please try again.');
        }
    };

    const handleShowApplicants = (jobId) => {
        if (selectedJobId === jobId) {
            setShowApplicants(false);
            setSelectedJobId(null);
            setApplicants([]);
        } else {
            axios.get(`http://127.0.0.1:8000/jobs/${jobId}/applicants/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then(response => {
                setApplicants(response.data);
                setSelectedJobId(jobId);
                setShowApplicants(true);
            })
            .catch(error => {
                console.error('Error fetching applicants:', error);
                alert('Error fetching applicants. Please try again.');
            });
        }
    };

    const getMatchingSkills = (jobSkills) => {
        const jobSkillSet = new Set(jobSkills.split(',').map(skill => skill.trim()));
        return userSkills.filter(skill => jobSkillSet.has(skill));
    };

    const handleDeleteJob = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/jobs/${jobId}/delete/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            alert('Job deleted successfully');
            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job');
        }
    };

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className='jobListings'>
            <h2>
                <i className="fa-solid fa-angles-down"></i>
                Jobs just for you
                <i className="fa-solid fa-angles-down"></i>
            </h2>
            {jobs.length === 0 && !loading ? (
                <p className='job-item'>No jobs available at the moment.</p>
            ) : (
                <ul>
                    {jobs.map(job => (
                        <li key={job.id} className="job-item">
                            <div className="job-image-container">
                                <img src={job.image} alt={`${job.title} logo`} className="job-image" />
                            </div>
                            <div className="job-details">
                                <h3>{job.title} at {job.company}</h3>
                                <p>{job.description}</p>
                                <p>Posted by <Link to={`/auth/profile/${job.creator.username}`}>{job.creator.username}</Link></p>
                                <p>{job.location}</p>
                                {user.username !== job.creator.username && (
                                    <>
                                        {getMatchingSkills(job.skills).length > 0 && (
                                            <div className="matching-skills">
                                                <h4>Matching Skills:</h4>
                                                <p>{getMatchingSkills(job.skills).join(', ')}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                {user.username === job.creator.username ? (
                                    <>
                                        <button onClick={() => handleShowApplicants(job.id)} className="apply-button">
                                            {showApplicants && selectedJobId === job.id ? 'Hide Applicants' : 'Show Who Applied'}
                                        </button>
                                        <button className='deleteButtonJobs' onClick={() => handleDeleteJob(job.id)}>
                                            Delete 
                                        </button>
                                        {showApplicants && selectedJobId === job.id && (
                                            <div className="applicants-section">
                                                <h4>Applicants for {job.company}</h4>
                                                <ul>
                                                    {applicants.map(applicant => (
                                                       <li key={applicant.id}>
                                                            <Link to={`../auth/profile/${applicant.user.username}`}>{applicant.user.username}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button onClick={() => handleApply(job.id)} className="apply-button">
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {loadingMore && <p>Loading more jobs...</p>}
        </div>
    );
};

export default JobList;
