import './nav.css';
import React, { useState,useContext} from 'react';
import AuthContext from './context/AuthContext'


const NavBar= () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [step, setStep] = useState(0);
    const handleLoginClick = () => {
        setStep(1); // Show the email 
    };
    
    
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setStep(2); // Show the password 
    };
    const {loginUser} = useContext(AuthContext)
    const handlePasswordSubmit = (e) => {
        //Login
        e.preventDefault();
        

        email.length > 0 && loginUser(email, password)

        console.log(email)
        console.log(password)
    };
     return(
        <nav className='main-nav'>
            <ul>{step === 0 && (<li><button onClick={handleLoginClick}>Login</button></li>)}

                {step === 1 && (
                    <li>
                        <form onSubmit={handleEmailSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <button className='button' type="submit">Next</button>
                        </form>
                    </li>
                )}
                {step === 2 && (
                    <li>
                        <form onSubmit={handlePasswordSubmit}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button className='button' type="submit">Login</button>
                        </form>
                    </li>
                )}

                 <li><a href="/register" >Create an account</a></li> {/*εδω θα μπει ο κωδικας για το register  */}
            </ul>
        </nav>
     );
};
export default NavBar