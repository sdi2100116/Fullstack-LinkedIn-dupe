import welcome from './AppImages/welcome.jpg';
import './welcome.css';

const Welcome = () => {
    const welcome_msg="Welcome to NetWork!";
    const info="A network of proffesionals, where you can find your next job, connect with future colleagues and choose qualified employees!  ";
     return(
        <div className="welcome-container">
        <h1 className='welcome-title'>{welcome_msg}</h1>
        <div className="content">
            <p className='info'>{info}</p>
            <img src={welcome} alt="Welcome people" className='welcome-image' />
        </div>
    </div>
     );
};

export default Welcome;