import Welcome from './Welcome';
import Header from './Header';
import NavBar from './Nav';
import NavBar2 from './NavAft';
import Footer from './Footer';
import Register from './Register'
import Frame from './Home/Frame'
import LeftFrame from './Home/LeftPart';
import Feed from './Home/Feed'
import SearchBar from './Network/SearchBar';
import UserPage from './UserPages';
import Profile from './Profile/Profile'
import ChPass from './Settings/ChangePassword';
import ChEmail from './Settings/ChangeEmail';
import LogoutButton from './Settings/LogoutButton';
import DeleteProfile from './Settings/DeleteProfile';
import Grid from './Network/Grid';
import NewConversation from './Chat/NewConvo';
import UserConversations from './Chat/Conversations';

import CreateJob from './Jobs/CreateJob';
import JobList from './Jobs/JobList';
import CNotifications from './Notifications/ConnectionNot';
import PNotifications from './Notifications/PostNot';
import CNotificationNumber from './Notifications/CNotificationNumber';
import AdminPage from './Admin/AdminPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute'
import PrivateAdminRoute from './utils/PrivateAdminRoute';
import { AuthProvider } from './context/AuthContext';


function App() {
  const isAdmin = localStorage.getItem("isAdmin");
  
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          
          <Routes>
            <Route path="/" element={<><Header /><NavBar /><Welcome /></>} />
            <Route path="/register" element={<><Header /><Register /></>} />
            <Route path="/auth/home" element={<PrivateRoute element={() => <><NavBar2 /><Frame /><LeftFrame /><Feed /></>} />} />
            <Route path="/auth/network" element={<PrivateRoute element={() => <><NavBar2 /><SearchBar /><Grid /></>} />} />
            <Route path="/auth/jobs" element={<PrivateRoute element={() => <><NavBar2 /><LeftFrame /><CreateJob /><JobList /></>} />} />
            <Route path="/auth/discussions" element={<PrivateRoute element={() => <><NavBar2 /><NewConversation /><UserConversations /></>} />} />
            <Route path="/auth/notifications" element={<PrivateRoute element={() => <><NavBar2 /><CNotifications /><PNotifications /></>} />} />
            <Route path="/auth/profile" element={<PrivateRoute element={() => <><NavBar2 /><Profile /></>} />} />
            <Route path="/auth/settings" element={<PrivateRoute element={() => <><NavBar2 /><ChPass /><ChEmail /><LogoutButton /><DeleteProfile /></>} />} />
            <Route path="/admin" element={<PrivateAdminRoute> <><Header /><AdminPage /> </></PrivateAdminRoute>} />
            <Route path="/auth/profile/:username" element={<PrivateRoute element={() => <><Header /><UserPage /></>} />} />
            {/* hey */}
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
