"use client";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 text-pink-500 mx-auto mb-4 animate-pulse">
            ❤️
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <HomePage />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/" replace />}
      />
      <Route
        path="/discover"
        element={user ? <Discover /> : <Navigate to="/" replace />}
      />
      <Route
        path="/matches"
        element={user ? <Matches /> : <Navigate to="/" replace />}
      />
      <Route
        path="/messages"
        element={user ? <Messages /> : <Navigate to="/" replace />}
      />
      <Route
        path="/messages/:id"
        element={user ? <Chat /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
