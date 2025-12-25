"use client";

import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import MultiStepRegister from "../components/auth/MultiStepRegister";
import { Button } from "../components/ui/Button";

const HomePage = () => {
  // const { user, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user && !isLoading) {
  //     navigate("/dashboard");
  //   }
  // }, [user, isLoading, navigate]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="h-12 w-12 text-pink-500 mx-auto mb-4 animate-pulse">
  //           ❤️
  //         </div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (user) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">❤️</span>
              <span className="text-xl font-bold text-gray-900">Bondly</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {/* <a
                href="#features"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                Success Stories
              </a> */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Hero content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  {" "}
                  Match
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of people finding meaningful relationships
                through our modern, secure platform designed for authentic
                connections and lasting love.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center space-x-3 bg-white/60 rounded-lg p-3">
                  <span className="text-pink-500">👥</span>
                  <span className="text-sm font-medium text-gray-700">
                    Smart Matching
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 rounded-lg p-3">
                  <span className="text-pink-500">💬</span>
                  <span className="text-sm font-medium text-gray-700">
                    Real-time Chat
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 rounded-lg p-3">
                  <span className="text-pink-500">🛡️</span>
                  <span className="text-sm font-medium text-gray-700">
                    Verified Profiles
                  </span>
                </div>
                <div className="flex items-center space-x-3 bg-white/60 rounded-lg p-3">
                  <span className="text-pink-500">❤️</span>
                  <span className="text-sm font-medium text-gray-700">
                    Genuine People
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8"
                  onClick={() => setShowRegister(true)}
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  className="text-gray-900 bg-white/50 hover:bg-white/80 hover:text-gray-900"
                  size="lg"
                  onClick={() => setShowRegister(false)}
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="flex-1 max-w-lg w-full">
              {showRegister ? (
                <MultiStepRegister
                  onSwitchToLogin={() => setShowRegister(false)}
                />
              ) : (
                <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Bondly?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've built the most advanced and secure platform for meaningful
              connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl mb-4 block">⚡</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Matching
              </h3>
              <p className="text-gray-600 text-sm">
                Advanced AI algorithms find your perfect matches in seconds
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Privacy First
              </h3>
              <p className="text-gray-600 text-sm">
                Your data is encrypted and protected with military-grade
                security
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl mb-4 block">🌍</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Global Community
              </h3>
              <p className="text-gray-600 text-sm">
                Connect with people from around the world or in your local area
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl mb-4 block">⭐</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Success Stories
              </h3>
              <p className="text-gray-600 text-sm">
                Join thousands of couples who found love through our platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">5+</div>
              <div className="text-pink-100">Active Users</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">3+</div>
              <div className="text-pink-100">Success Stories</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">95%</div>
              <div className="text-pink-100">Match Success Rate</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">24/7</div>
              <div className="text-pink-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">❤️</span>
              <span className="text-lg font-bold">Bondly</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Bondly. All rights reserved. Made
              with ❤️ for meaningful connections.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
