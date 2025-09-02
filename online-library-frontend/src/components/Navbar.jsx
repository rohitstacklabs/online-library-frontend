import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      className="relative bg-cover bg-center shadow-md"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide hover:text-yellow-400 transition duration-300"
        >
          📚 Online Library
        </Link>

        <div className="flex flex-wrap items-center space-x-4 text-white font-medium">
          <Link
            to="/books"
            className="hover:text-yellow-400 transition duration-300"
          >
            Books
          </Link>

          {user ? (
            <>
              <Link
                to="/history"
                className="hover:text-yellow-400 transition duration-300"
              >
                History
              </Link>
              <Link
                to="/profile"
                className="hover:text-yellow-400 transition duration-300"
              >
                Profile
              </Link>

              <NotificationBell />

              {user.role === "ADMIN" && (
                <>
                  <Link
                    to="/users"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Users
                  </Link>
                  <Link
                    to="/reports"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Reports
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="ml-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-400 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-yellow-400 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
