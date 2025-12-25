"use client";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "./components/AuthInitializer";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Chat from "./pages/chat";
import LoginForm from "./components/auth/LoginForm";
import MultiStepRegister from "./components/auth/MultiStepRegister";

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // console.log(user);

  return (
    <AuthInitializer>
      <>
        <Toaster position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/discover" replace /> : <HomePage />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginForm />
            ) : (
              <Navigate to="/discover" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/discover"
          element={isAuthenticated ? <Discover /> : <Navigate to="/" replace />}
        />
        <Route
          path="/matches"
          element={isAuthenticated ? <Matches /> : <Navigate to="/" replace />}
        />
        <Route
          path="/messages"
          element={isAuthenticated ? <Messages /> : <Navigate to="/" replace />}
        />
        <Route
          path="/messages/:id"
          element={isAuthenticated ? <Chat /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chat/:conversationId"
          element={isAuthenticated ? <Chat /> : <Navigate to="/" replace />}
        />
      </Routes>
      </>
    </AuthInitializer>
  );
}

export default App;
