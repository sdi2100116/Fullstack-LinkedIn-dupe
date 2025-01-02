import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ element: Element }) => {
  const { user } = useContext(AuthContext);
  
  return user ? <Element /> : <Navigate to="/" replace />;

};

export default PrivateRoute;