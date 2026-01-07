"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/constant";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  /**
   * Fetch all conversations for the current user
   */
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/conversation/all`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await res.json();
      console.log("Conversations fetched:", data.data);
      setConversations(data.data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get image URL from profile images array
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  /**
   * Handle conversation click to navigate to chat
   */
  const handleConversationClick = (conversationId, otherUserId) => {
    navigate(`/chat/${conversationId}`, {
      state: { otherUserId },
    });
  };

  /**
   * Filter conversations by search query
   */
  const filteredConversations = conversations.filter((conversation) =>
    conversation.otherUser?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  /**
   * Format timestamp for display
   */
  const formatTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>

          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">🔍</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Loading conversations...</p>
            </CardContent>
          </Card>
        ) : filteredConversations.length === 0 ? (
          /* Empty State */
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {conversations.length === 0
                  ? "No conversations yet"
                  : "No matching conversations"}
              </h3>
              <p className="text-gray-600">
                {conversations.length === 0
                  ? "Start matching with people to begin conversations!"
                  : "Try searching for a different name."}
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Conversations List */
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation._id}
                className="hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-pink-200"
                onClick={() =>
                  handleConversationClick(
                    conversation._id,
                    conversation.otherUser._id
                  )
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={getImageUrl(
                          conversation.otherUser?.profileImages?.[0]
                        )}
                        alt={conversation.otherUser?.name}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-gray-200"
                        onError={(e) => (e.target.src = "/placeholder.svg")}
                      />
                      {/* Online Status Indicator */}
                      {/* Add online status from your user model if available */}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      {/* Header: Name and Timestamp */}
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">
                          {conversation.otherUser?.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                          {formatTimeAgo(conversation.lastMessageTime)}
                        </span>
                      </div>

                      {/* User Location and Online Status */}
                      <p className="text-xs text-gray-500 mb-1.5 truncate">
                        {conversation.otherUser?.location || "Location unknown"}
                      </p>

                      {/* Last Message Preview */}
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm truncate flex-1 ${
                            conversation.unreadCount?.user1 > 0 ||
                            conversation.unreadCount?.user2 > 0
                              ? "text-gray-900 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {conversation.lastMessage ||
                            "No messages yet. Start the conversation!"}
                        </p>

                        {/* Unread Badge */}
                        {(conversation.unreadCount?.user1 > 0 ||
                          conversation.unreadCount?.user2 > 0) && (
                          <div className="bg-pink-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center flex-shrink-0">
                            {conversation.unreadCount?.user1 ||
                              conversation.unreadCount?.user2}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Messages;
