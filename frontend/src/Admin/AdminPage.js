import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver'; // For exporting files
import { Link } from 'react-router-dom';
import "./adminPage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;

    // Fetch basic user data
    axios.get('http://127.0.0.1:8000/api/users/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => {
        setUsers(response.data);
        
        // Fetch detailed data for each user
        const userRequests = response.data.map(user =>
          axios.get(`http://127.0.0.1:8000/api/user_for_admin/${user.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
        );
        
        Promise.all(userRequests)
          .then(responses => {
            const details = {};
            responses.forEach(response => {
              details[response.data.user.id] = response.data;
            });
            setUserDetails(details);
          })
          .catch(error => console.error('Error fetching user details:', error));
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleExport = () => {
    
    const usersToExport = users.filter(user => selectedUsers.includes(user.id));
    
    
    if (!usersToExport.length) return;
  
    let blob;
  
    if (exportFormat === 'json') {
      // Format the data for JSON export
      const dataToExport = usersToExport.map(user => {
        
        const details = userDetails[user.id] || {};
  
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: details.user?.name || '',
          last_name: details.user?.last_name || '',
          phone_number: details.user?.phone || '',
          bio: details.user?.bio || '',
          skills: details.skills ? details.skills.map(skill => ({
            id: skill.id,
            name: skill.name,
            is_public: skill.is_public
          })) : [],
          education: details.education ? details.education.map(edu => ({
            id: edu.id,
            school: edu.school,
            degree: edu.degree,
            start_date: edu.start_date,
            end_date: edu.end_date,
            is_public: edu.is_public
          })) : [],
          experience: details.experience ? details.experience.map(exp => ({
            id: exp.id,
            work_name: exp.work_name,
            job: exp.job,
            start_date: exp.start_date,
            end_date: exp.end_date,
            is_public: exp.is_public
          })) : [],
          posts: details.posts ? details.posts.map(post => ({
            id: post.id,
            title: post.title,
            body: post.body,
            created_at: new Date(post.created_at).toLocaleDateString() // Format date
          })) : [],
          interests: details.interests ? details.interests.map(interest => ({
            post_title: interest.post__title,
            created_at: new Date(interest.created_at).toLocaleDateString() // Format date
          })) : [],
          comments: details.comments ? details.comments.map(comment => ({
            post_title: comment.post__title,
            comment_body: comment.comment_body,
            created_at: new Date(comment.created_at).toLocaleDateString() // Format date
          })) : [],
          jobs: details.jobs ? details.jobs.map(job => ({
            id: job.id,
            title: job.title,
            description: job.description,
            created_at: new Date(job.created_at).toLocaleDateString() // Format date
          })) : []
        };
      });
  
      blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
  
    } else if (exportFormat === 'xml') {
      // Convert data to XML format
      const xmlData = usersToExport.map(user => {
        const details = userDetails[user.id] || {};
        const skillsXML = details.skills ? details.skills.map(skill => 
          `<skill>
            <id>${skill.id}</id>
            <name>${skill.name}</name>
            <is_public>${skill.is_public}</is_public>
          </skill>`
        ).join('\n') : '';
        
        const educationXML = details.education ? details.education.map(edu => 
          `<education>
            <id>${edu.id}</id>
            <school>${edu.school}</school>
            <degree>${edu.degree}</degree>
            <start_date>${edu.start_date}</start_date>
            <end_date>${edu.end_date}</end_date>
            <is_public>${edu.is_public}</is_public>
          </education>`
        ).join('\n') : '';
        
        const experienceXML = details.experience ? details.experience.map(exp => 
          `<experience>
            <id>${exp.id}</id>
            <work_name>${exp.work_name}</work_name>
            <job>${exp.job}</job>
            <start_date>${exp.start_date}</start_date>
            <end_date>${exp.end_date}</end_date>
            <is_public>${exp.is_public}</is_public>
          </experience>`
        ).join('\n') : '';
        
        const postsXML = details.posts ? details.posts.map(post => 
          `<post>
            <id>${post.id}</id>
            <title>${post.title}</title>
            <body>${post.body}</body>
            <created_at>${new Date(post.created_at).toLocaleDateString()}</created_at> <!-- Format date -->
          </post>`
        ).join('\n') : '';
        
        const interestsXML = details.interests ? details.interests.map(interest => 
          `<interest>
            <post_title>${interest.post__title}</post_title>
            <created_at>${new Date(interest.created_at).toLocaleDateString()}</created_at> <!-- Format date -->
          </interest>`
        ).join('\n') : '';
        
        const commentsXML = details.comments ? details.comments.map(comment => 
          `<comment>
            <post_title>${comment.post__title}</post_title>
            <comment_body>${comment.comment_body}</comment_body>
            <created_at>${new Date(comment.created_at).toLocaleDateString()}</created_at> <!-- Format date -->
          </comment>`
        ).join('\n') : '';
        
        const jobsXML = details.jobs ? details.jobs.map(job => 
          `<job>
            <id>${job.id}</id>
            <title>${job.title}</title>
            <description>${job.description}</description>
            <created_at>${new Date(job.created_at).toLocaleDateString()}</created_at> <!-- Format date -->
          </job>`
        ).join('\n') : '';
        
        return `<user>
          <id>${user.id}</id>
          <username>${user.username}</username>
          <email>${user.email}</email>
          <first_name>${details.user?.name || ''}</first_name>
          <last_name>${details.user?.last_name || ''}</last_name>
          <phone_number>${details.user?.phone || ''}</phone_number>
          <bio>${details.user?.bio || ''}</bio>
          <skills>\n${skillsXML}\n</skills>
          <education>\n${educationXML}\n</education>
          <experience>\n${experienceXML}\n</experience>
          <posts>\n${postsXML}\n</posts>
          <interests>\n${interestsXML}\n</interests>
          <comments>\n${commentsXML}\n</comments>
          <jobs>\n${jobsXML}\n</jobs>
        </user>`;
      }).join('\n');
      
      blob = new Blob([`<users>\n${xmlData}\n</users>`], { type: 'application/xml' });
    }
  
    saveAs(blob, `users.${exportFormat}`);
  };
  
  

  return (
    <div className="adminPage">
      <h1 className='titleAdmin'>Administration</h1>
      <div className='exportAdmin'>
        <label className='labelAdmin'>
          Export Format:
          <select className='selectAdmin' value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
            <option className='optionAdmin' value="json">JSON</option>
            <option className='optionAdmin' value="xml">XML</option>
          </select>
        </label>
        <button className='buttonAdmin' onClick={handleExport}>Export Selected Users</button>
      </div>
      <div className='usersAdmin'>
        <h2 className='titleusersAdmin'>Users</h2>
        <ul className="listusersAdmin">
          {users.map(user => (
            <li 
              key={user.id} 
              className={selectedUsers.includes(user.id) ? 'selectedUser' : ''}
            >
              <input
                className='checkusersAdmin'
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleUserSelect(user.id)}
              />
              <Link to={`/auth/profile/${user.username}`} className="linkusersAdmin">
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
