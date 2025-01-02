import './header.css';
import logo from './logo.png';

const Header = ({ name }) => {
    return(
        
            <header className="page-header">
                <img src={logo} alt="Logo" />
            </header>
    );
     
};
export default Header;