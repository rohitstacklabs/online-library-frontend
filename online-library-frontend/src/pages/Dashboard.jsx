import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaUserCircle, FaCrown, FaUserShield } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isActive = new Date(user.membershipEndDate) > new Date();

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
        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-blue-500 text-7xl" />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Welcome, {user.name}
        </h2>
        <p className="text-gray-600 mb-6">We’re glad to have you back 🎉</p>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-500 text-xl" />
            <p className="text-lg text-gray-800">
              <span className="font-semibold">Membership: </span>
              {isActive ? (
                <span className="text-green-600">Active ✅</span>
              ) : (
                <span className="text-red-500">Expired ❌</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaUserShield className="text-purple-500 text-xl" />
            <p className="text-lg text-gray-800">
              <span className="font-semibold">Role: </span> {user.role}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
