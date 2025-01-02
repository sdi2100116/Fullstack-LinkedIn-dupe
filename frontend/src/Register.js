import {useState, useContext} from 'react'
import './register.css';
import AuthContext from './context/AuthContext'

const UserRegistrationForm = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [first_name, setFirst] = useState("")
  const [last_name, setLast] = useState("")
  const [phone_number, setPhone] = useState("")
  const [photo, setPhoto] = useState("")


  const {registerUser} = useContext(AuthContext)


  console.log(email);
  console.log(username);
  console.log(password);
  console.log(password2);
  console.log(phone_number);
  console.log(first_name);
  console.log(last_name);
  console.log(photo);
  
  
 



  const handleSubmit = async e => {
    e.preventDefault()
    registerUser(email, username, password, password2,phone_number,first_name,last_name,photo)
  }

  return (
    <div class="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} class="registration-form">
      <div>
          <label htmlFor="firstName">Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            onChange={e => setFirst(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            onChange={e => setLast(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div> 
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div> 
         
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={e => setPassword2(e.target.value)}
            required
          />
        </div>
        
        
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="photo">Profile Picture:</label>
          <input
            type="file"
            id="photo"
            name="photo"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;