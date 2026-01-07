"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { TypingIndicator } from "../components/chat/TypingIndicater";
import { UserProfileModal } from "../components/chat/UserProfileModal";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../utils/constant";
import toast from "react-hot-toast";

const Chat = () => {
  const { conversationId, id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  // Use conversationId from URL params (priority) or fallback to id
  const chatId = conversationId || id;

  // State Management
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const messagesEndRef = useRef(null);

  /**
   * Auto-scroll to bottom when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /**
   * Fetch messages on component mount
   */
  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  /**
   * Fetch conversation messages
   */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BACKEND_URL}/conversation/${chatId}/messages`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await res.json();
      console.log("Messages fetched:", data.data);

      // Set messages and extract other user info
      setMessages(data.data || []);

      // Get other user from first message if available
      if (data.data && data.data.length > 0) {
        const firstMessage = data.data[0];
        const other =
          firstMessage.fromUser._id === currentUser._id
            ? firstMessage.toUser
            : firstMessage.fromUser;
        setOtherUser(other);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mark messages as read
   */
  const markMessagesAsRead = async () => {
    try {
      await fetch(`${BACKEND_URL}/message/${chatId}/mark-read`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  /**
   * Send a new message
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    try {
      setSending(true);

      const res = await fetch(`${BACKEND_URL}/message/send`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: chatId,
          content: newMessage.trim(),
          messageType: "text",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      console.log("Message sent:", data.data);

      // Add message to state
      setMessages([...messages, data.data]);
      setNewMessage("");

      // Mark as read
      await markMessagesAsRead();

      toast.success("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  /**
   * Delete a message
   */
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/message/${messageId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete message");
      }

      // Update message locally instead of removing it
      setMessages(
        messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, content: "This message was deleted" }
            : msg
        )
      );

      toast.success("Message deleted!");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  /**
   * Get image URL
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  /**
   * Format time for display
   */
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto h-96 flex items-center justify-center">
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </DashboardLayout>
    );
  }
  console.log("Rendering chat with messages:", messages);
  return (
    <DashboardLayout>
      <div className="mx-auto  flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-160px)]">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => navigate("/messages")}
              className="text-gray-600 hover:text-gray-900 text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              aria-label="Back to messages"
            >
              ←
            </button>
            {otherUser && (
              <div
                onClick={() => setShowProfileModal(true)}
                className="flex-1 mx-2 cursor-pointer hover:bg-gray-50 p-2 md:p-3 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={getImageUrl(otherUser.profileImages?.[0])}
                    alt={otherUser.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-pink-500 flex-shrink-0"
                    onError={(e) => (e.target.src = "/placeholder.svg")}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-0.5">
                      <h2 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {otherUser.name}
                      </h2>
                      {otherUser.age && (
                        <span className="text-gray-600 text-sm flex-shrink-0">
                          {otherUser.age}
                        </span>
                      )}
                    </div>
                    {otherUser.location && (
                      <p className="text-xs text-gray-600 truncate">
                        📍 {otherUser.location}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">Active now</p>
                  </div>
                </div>
              </div>
            )}
            <div className="w-8 flex-shrink-0" />{" "}
            {/* Placeholder for layout balance */}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="text-4xl mb-2">👋</div>
              <p className="text-gray-600 text-sm md:text-base">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSender = msg.fromUser._id === currentUser._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-xs px-3 py-2 rounded-2xl shadow-sm ${
                      isSender
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-sm"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {msg.content}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <p
                        className={`text-xs ${
                          isSender ? "text-pink-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                      {isSender && msg.isRead && (
                        <span className="text-xs text-pink-100">✓✓</span>
                      )}
                    </div>

                    {isSender && (
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="text-xs text-pink-100 hover:text-white mt-1.5 underline focus:outline-none focus:ring-2 focus:ring-white rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex justify-start items-end gap-2">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-3 md:p-4 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              className="flex-1 min-h-[40px] md:min-h-[44px] resize-none"
            />
            <Button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 md:px-6 h-10 md:h-11 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all"
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && otherUser && (
        <UserProfileModal
          userId={otherUser._id}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default Chat;
