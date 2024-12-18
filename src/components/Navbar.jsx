import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Bell className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                NotifyHub
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/create-notification"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Create Notification
                  </Link>
                )}
                <div className="relative mx-4">
                  <Bell className="h-6 w-6 text-gray-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${
                    location.pathname.includes("/login")
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`${
                    location.pathname.includes("/register")
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-gray-900"
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
