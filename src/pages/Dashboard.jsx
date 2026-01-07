"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/constant";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    welcome: {
      name: "",
      newMatches: 0,
      unreadMessages: 0,
    },
    stats: [],
    recentMatches: [],
    recentActivity: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/dashboard`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await res.json();
      console.log("Dashboard API Response:", data);
      if (data.data) {
        setDashboardData(data.data);
      } else {
        console.error("No data in response:", data);
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      // Set default values on error
      setDashboardData({
        welcome: {
          name: "User",
          newMatches: 0,
          unreadMessages: 0,
        },
        stats: [
          { label: "Profile Views", value: "0", change: "0%" },
          { label: "Matches", value: "0", change: "0%" },
          { label: "Messages", value: "0", change: "0%" },
          { label: "Likes Received", value: "0", change: "0%" },
        ],
        recentMatches: [],
        recentActivity: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/diverse-user-avatars.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  const handleMessageClick = async (matchId) => {
    try {
      // Navigate to initiate conversation or existing chat
      const res = await fetch(
        `${BACKEND_URL}/conversation/initiate/${matchId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        navigate(`/chat/${data.data._id}`);
      } else {
        toast.error("Failed to start conversation");
      }
    } catch (error) {
      console.error("Error initiating conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {dashboardData.welcome.name}! 👋
          </h1>
          <p className="text-pink-100">
            You have {dashboardData.welcome.newMatches} new matches and{" "}
            {dashboardData.welcome.unreadMessages} unread messages waiting for
            you.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.stats.map((stat, index) => (
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
                {dashboardData.recentMatches.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No recent matches yet
                  </p>
                ) : (
                  dashboardData.recentMatches.map((match) => (
                    <div
                      key={match.id || match._id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <img
                        src={getImageUrl(match.avatar)}
                        alt={match.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) =>
                          (e.target.src = "/diverse-user-avatars.png")
                        }
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {match.name}, {match.age}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {match.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-pink-600">
                          {match.compatibility}% match
                        </div>
                        <Button
                          size="sm"
                          className="mt-1"
                          onClick={() => handleMessageClick(match._id)}
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  ))
                )}
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
                {dashboardData.recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  dashboardData.recentActivity.map((activity, index) => (
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
                  ))
                )}
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
