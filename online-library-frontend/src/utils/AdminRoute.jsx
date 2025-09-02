import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return user && user.role === 'ADMIN' ? children : <Navigate to="/" />;
};

export default AdminRoute;