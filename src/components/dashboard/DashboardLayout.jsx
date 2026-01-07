"use client";

import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { useSelector, useDispatch } from "react-redux";
import { AVATAR_URL, navItems, BACKEND_URL } from "../../utils/constant";
import { logout } from "../../store/slices/authSlice";

const DashboardLayout = ({ children }) => {
  // const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return AVATAR_URL;
    // If it's a relative path, prepend the backend URL
    if (imagePath.startsWith("/")) {
      return `${BACKEND_URL}${imagePath}`;
    }
    return imagePath;
  };

  // Get user's profile image (first image or avatar)
  const userProfileImage = user?.profileImages?.[0]
    ? getImageUrl(user.profileImages[0])
    : AVATAR_URL;

  const handleLogout = () => {
    // logout();
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">❤️</span>
          <span className="text-xl font-bold text-gray-900">Bondly</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          aria-label="Toggle menu"
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col h-screen`}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Logo */}
            <div className="flex items-center space-x-2 p-6 border-b border-gray-200 flex-shrink-0">
              <span className="text-2xl">❤️</span>
              <span className="text-xl font-bold text-gray-900">Bondly</span>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <img
                  src={userProfileImage}
                  alt={user?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                  onError={(e) => {
                    console.error(
                      "Profile image failed to load:",
                      userProfileImage
                    );
                    e.target.src = AVATAR_URL;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                        location.pathname === item.path
                          ? "bg-pink-50 text-pink-600 border border-pink-200 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0 min-w-0">
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export { DashboardLayout };
