"use client";

import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const mockMatches = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 26,
    location: "New York, NY",
    avatar: "/profile-photo-1.png",
    lastMessage: "Hey! How's your day going?",
    timestamp: "2 hours ago",
    isOnline: true,
  },
  {
    id: 2,
    name: "Emily Chen",
    age: 24,
    location: "Brooklyn, NY",
    avatar: "/profile-photo-2.png",
    lastMessage: "That restaurant looks amazing!",
    timestamp: "1 day ago",
    isOnline: false,
  },
  {
    id: 3,
    name: "Jessica Williams",
    age: 29,
    location: "Manhattan, NY",
    avatar: "/diverse-user-avatars.png",
    lastMessage: "Would love to go hiking this weekend",
    timestamp: "3 days ago",
    isOnline: true,
  },
];

const mockLikes = [
  {
    id: 4,
    name: "Amanda Rodriguez",
    age: 27,
    location: "Queens, NY",
    avatar: "/profile-photo-1.png",
    timestamp: "1 hour ago",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    age: 25,
    location: "Brooklyn, NY",
    avatar: "/profile-photo-2.png",
    timestamp: "4 hours ago",
  },
];

const Matches = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const navigate = useNavigate();

  const handleMessageClick = (matchId) => {
    navigate(`/messages/${matchId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Matches</h1>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("matches")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "matches"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Matches ({mockMatches.length})
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "likes"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Likes You ({mockLikes.length})
            </button>
          </div>
        </div>

        {activeTab === "matches" && (
          <div className="space-y-4">
            {mockMatches.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">💕</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No matches yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start swiping to find your perfect match!
                  </p>
                  <Button
                    onClick={() => navigate("/discover")}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Start Discovering
                  </Button>
                </CardContent>
              </Card>
            ) : (
              mockMatches.map((match) => (
                <Card
                  key={match.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={match.avatar || "/placeholder.svg"}
                          alt={match.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        {match.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {match.name}, {match.age}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {match.location}
                        </p>
                        <p className="text-sm text-gray-700">
                          {match.lastMessage}
                        </p>
                        <p className="text-xs text-gray-500">
                          {match.timestamp}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleMessageClick(match.id)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockLikes.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">👀</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No likes yet
                    </h3>
                    <p className="text-gray-600">
                      People who like you will appear here
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              mockLikes.map((like) => (
                <Card
                  key={like.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 text-center">
                    <img
                      src={like.avatar || "/placeholder.svg"}
                      alt={like.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                    />
                    <h3 className="font-medium text-gray-900 mb-1">
                      {like.name}, {like.age}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {like.location}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Liked you {like.timestamp}
                    </p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        Like Back
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        Pass
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Matches;
