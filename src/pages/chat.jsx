"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { MessageBubble } from "../components/chat/MessageBubble";
import { TypingIndicator } from "../components/chat/TypingIndicater";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const mockUsers = {
  1: {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/profile-photo-1.png",
    isOnline: true,
    lastSeen: "Active now",
  },
  2: {
    id: 2,
    name: "Emily Chen",
    avatar: "/profile-photo-2.png",
    isOnline: false,
    lastSeen: "Active 2 hours ago",
  },
  3: {
    id: 3,
    name: "Jessica Williams",
    avatar: "/diverse-user-avatars.png",
    isOnline: true,
    lastSeen: "Active now",
  },
};

const mockMessages = {
  1: [
    {
      id: 1,
      senderId: 1,
      text: "Hey! How's your day going?",
      timestamp: "2:30 PM",
      isRead: true,
    },
    {
      id: 2,
      senderId: "current",
      text: "Hi Sarah! It's going great, thanks for asking. How about yours?",
      timestamp: "2:32 PM",
      isRead: true,
    },
    {
      id: 3,
      senderId: 1,
      text: "Pretty good! I just finished a great workout. Do you like staying active?",
      timestamp: "2:35 PM",
      isRead: true,
    },
    {
      id: 4,
      senderId: "current",
      text: "I love hiking and yoga. What kind of workouts do you enjoy?",
      timestamp: "2:37 PM",
      isRead: false,
    },
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      text: "That restaurant looks amazing! We should definitely go there sometime.",
      timestamp: "Yesterday",
      isRead: true,
    },
  ],
  3: [
    {
      id: 1,
      senderId: 3,
      text: "Would love to go hiking this weekend if you're free!",
      timestamp: "Monday",
      isRead: false,
    },
  ],
};

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState(mockMessages[id] || []);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const chatUser = mockUsers[id];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Simulate typing indicator
    if (chatUser?.isOnline && Math.random() > 0.7) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [chatUser?.isOnline]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      senderId: "current",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate response
    if (chatUser?.isOnline && Math.random() > 0.5) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const responses = [
            "That sounds great!",
            "I'd love to hear more about that",
            "When works for you?",
            "That's so interesting!",
            "I completely agree",
          ];
          const response = {
            id: messages.length + 2,
            senderId: Number.parseInt(id),
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isRead: true,
          };
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
        }, 1500);
      }, 1000);
    }
  };

  if (!chatUser) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Conversation not found
          </h2>
          <Button onClick={() => navigate("/messages")}>
            Back to Messages
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-4">
          <button
            onClick={() => navigate("/messages")}
            className="text-gray-600 hover:text-gray-900"
          >
            <span className="text-xl">←</span>
          </button>
          <img
            src={chatUser.avatar || "/placeholder.svg"}
            alt={chatUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h2 className="font-medium text-gray-900">{chatUser.name}</h2>
            <p className="text-sm text-gray-500">{chatUser.lastSeen}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              📞
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              📹
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === "current"}
              senderAvatar={
                message.senderId === "current" ? user?.avatar : chatUser.avatar
              }
            />
          ))}
          {isTyping && <TypingIndicator avatar={chatUser.avatar} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
