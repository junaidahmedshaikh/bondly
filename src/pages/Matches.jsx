"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from "../utils/constant";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_BASE_URL}/request/received`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched requests:", data);

        if (data.data && Array.isArray(data.data)) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Separate received requests into matches and likes based on status
  const matches = requests.filter((req) => req.status === "accepted");
  const likes = requests.filter((req) => req.status === "interested");

  const handleMessageClick = async (userId) => {
    try {
      console.log("Initiating conversation with user:", userId);

      // Initiate conversation
      const res = await fetch(
        `${BACKEND_BASE_URL}/conversation/initiate/${userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to initiate conversation");
      }

      const data = await res.json();
      const conversationId = data.data._id;

      console.log("Conversation initiated:", conversationId);

      // Navigate to chat with conversation ID
      navigate(`/chat/${conversationId}`, { state: { otherUserId: userId } });
    } catch (error) {
      console.error("Error initiating conversation:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  const handleLikeBack = async (requestId) => {
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/request/respond/${requestId}/accept`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        console.log("Liked back successfully");
        // Update the request status locally
        setRequests(
          requests.map((req) =>
            req._id === requestId ? { ...req, status: "accepted" } : req
          )
        );
      } else {
        console.error("Failed to like back");
      }
    } catch (error) {
      console.error("Error liking back:", error);
    }
  };

  const handlePass = async (requestId) => {
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/request/respond/${requestId}/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        console.log("Request rejected successfully");
        // Remove the request from the list
        setRequests(requests.filter((req) => req._id !== requestId));
      } else {
        console.error("Failed to reject");
      }
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  };
  // console.log("Matches:", matches);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Matches</h1>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("matches")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                activeTab === "matches"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Matches ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                activeTab === "likes"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Likes You ({likes.length})
            </button>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Loading...</p>
            </CardContent>
          </Card>
        ) : activeTab === "matches" ? (
          <div className="space-y-4">
            {matches.length === 0 ? (
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
              matches.map((request) => (
                <Card
                  key={request._id}
                  className="hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-pink-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={getImageUrl(
                            request.fromUserDetails?.profileImages?.[0]
                          )}
                          alt={request.fromUserDetails?.name}
                          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-gray-200"
                          onError={(e) => (e.target.src = "/placeholder.svg")}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                          {request.fromUserDetails?.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 mb-1 truncate">
                          {request.fromUserDetails?.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          Matched{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <Button
                        onClick={() =>
                          handleMessageClick(request.fromUserDetails?._id)
                        }
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      >
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {likes.length === 0 ? (
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
              likes.map((request) => (
                <Card
                  key={request._id}
                  className="hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-pink-200"
                >
                  <CardContent className="p-4 md:p-5 text-center">
                    <img
                      src={getImageUrl(
                        request?.fromUserDetails?.profileImages?.[0]
                      )}
                      alt={request?.fromUserDetails?.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto mb-3 ring-2 ring-gray-200"
                      onError={(e) => (e.target.src = "/placeholder.svg")}
                    />
                    <h3 className="font-semibold text-gray-900 mb-1 text-base md:text-lg">
                      {request?.fromUserDetails?.name},{" "}
                      {request?.fromUserDetails?.age}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {request?.fromUserDetails?.location}
                    </p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {request?.fromUserDetails?.bio}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Liked you{" "}
                      {new Date(
                        request?.fromUserDetails?.createdAt
                      ).toLocaleDateString()}
                    </p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        onClick={() => handleLikeBack(request._id)}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      >
                        Like Back
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePass(request._id)}
                        className="w-full bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
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
