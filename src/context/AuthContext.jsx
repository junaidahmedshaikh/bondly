"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem("connectme_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("connectme_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // API call to backend
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    const userData = {
      id: "1",
      email,
      name: email.split("@")[0],
      avatar: "/diverse-user-avatars.png",
      bio: "Love traveling and meeting new people!",
      age: 28,
      location: "New York, NY",
      interests: ["Travel", "Photography", "Cooking"],
      photos: ["/profile-photo-1.png", "/profile-photo-2.png"],
    };

    setUser(userData);
    localStorage.setItem("connectme_user", JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    // API call to backend
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      avatar: userData.photos?.[0] || "/diverse-user-avatars.png",
    };

    setUser(newUser);
    localStorage.setItem("connectme_user", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("connectme_user");
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("connectme_user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
