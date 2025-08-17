"use client";

import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";

const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/profile-photo-1.png",
    lastMessage: "Hey! How's your day going?",
    timestamp: "2:30 PM",
    unreadCount: 2,
    isOnline: true,
    lastSeen: "Active now",
  },
  {
    id: 2,
    name: "Emily Chen",
    avatar: "/profile-photo-2.png",
    lastMessage:
      "That restaurant looks amazing! We should definitely go there sometime.",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    lastSeen: "Active 2 hours ago",
  },
  {
    id: 3,
    name: "Jessica Williams",
    avatar: "/diverse-user-avatars.png",
    lastMessage: "Would love to go hiking this weekend if you're free!",
    timestamp: "Monday",
    unreadCount: 1,
    isOnline: true,
    lastSeen: "Active now",
  },
  {
    id: 4,
    name: "Amanda Rodriguez",
    avatar: "/profile-photo-1.png",
    lastMessage: "Thanks for the movie recommendation!",
    timestamp: "Sunday",
    unreadCount: 0,
    isOnline: false,
    lastSeen: "Active 1 day ago",
  },
];

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>

          {/* Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          {filteredConversations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-600">
                  Start matching with people to begin conversations!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleConversationClick(conversation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {conversation.timestamp}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        {conversation.lastSeen}
                      </p>
                      <p
                        className={`text-sm truncate ${
                          conversation.unreadCount > 0
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
