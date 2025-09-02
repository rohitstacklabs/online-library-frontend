import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        <h1 className="text-3xl font-bold mt-4 text-gray-800">My Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account details</p>

        <div className="mt-6 space-y-3 text-left">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="text-gray-800">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-indigo-600 font-medium">{user?.role}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-gray-600">Membership Start:</span>
            <span className="text-gray-800">{user?.membershipStartDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Membership End:</span>
            <span className="text-gray-800">{user?.membershipEndDate}</span>
          </div>
        </div>

        <div className="mt-8">
          <Link 
            to="/change-password" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg shadow transition"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
