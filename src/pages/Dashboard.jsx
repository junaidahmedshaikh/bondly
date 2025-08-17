"use client";

import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "Profile Views", value: "127", change: "+12%" },
    { label: "Matches", value: "23", change: "+5%" },
    { label: "Messages", value: "8", change: "+2%" },
    { label: "Likes Received", value: "45", change: "+18%" },
  ];

  const recentMatches = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 26,
      location: "New York, NY",
      avatar: "/profile-photo-1.png",
      compatibility: 92,
    },
    {
      id: 2,
      name: "Emily Chen",
      age: 24,
      location: "Brooklyn, NY",
      avatar: "/profile-photo-2.png",
      compatibility: 88,
    },
    {
      id: 3,
      name: "Jessica Williams",
      age: 29,
      location: "Manhattan, NY",
      avatar: "/diverse-user-avatars.png",
      compatibility: 85,
    },
  ];

  const recentActivity = [
    {
      type: "match",
      message: "You matched with Sarah Johnson",
      time: "2 hours ago",
    },
    {
      type: "like",
      message: "Emily Chen liked your profile",
      time: "4 hours ago",
    },
    {
      type: "message",
      message: "New message from Jessica Williams",
      time: "1 day ago",
    },
    {
      type: "view",
      message: "Your profile was viewed 5 times",
      time: "2 days ago",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-pink-100">
            You have 3 new matches and 2 unread messages waiting for you.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Matches</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/matches")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={match.avatar || "/placeholder.svg"}
                      alt={match.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {match.name}, {match.age}
                      </h3>
                      <p className="text-sm text-gray-500">{match.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-pink-600">
                        {match.compatibility}% match
                      </div>
                      <Button size="sm" className="mt-1">
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">
                        {activity.type === "match" && "💕"}
                        {activity.type === "like" && "❤️"}
                        {activity.type === "message" && "💬"}
                        {activity.type === "view" && "👁️"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                onClick={() => navigate("/discover")}
              >
                <span className="text-2xl">🔍</span>
                <span>Discover People</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                onClick={() => navigate("/profile")}
              >
                <span className="text-2xl">✏️</span>
                <span>Edit Profile</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                onClick={() => navigate("/messages")}
              >
                <span className="text-2xl">💬</span>
                <span>View Messages</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
