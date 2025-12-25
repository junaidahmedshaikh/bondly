"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { BACKEND_BASE_URL } from "../../utils/constant";
import toast from "react-hot-toast";

const UserProfileModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_BASE_URL}/profile/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await res.json();
      setUser(data.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/diverse-user-avatars.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_BASE_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">User not found</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto  bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Close modal"
          >
            ×
          </button>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
                src={getImageUrl(user.profileImages?.[0] || user.profileURL)}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-pink-500"
                onError={(e) => (e.target.src = "/diverse-user-avatars.png")}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {user.name}
                {user.age && (
                  <span className="text-gray-600">, {user.age}</span>
                )}
              </h2>
              {user.location && (
                <p className="text-gray-600 flex items-center justify-center gap-1">
                  <span>📍</span>
                  {user.location}
                </p>
              )}
            </div>
          </div>

          {/* Profile Images Gallery */}
          {user.profileImages && user.profileImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Photos
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {user.profileImages.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${user.name} photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) =>
                      (e.target.src = "/diverse-user-avatars.png")
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { UserProfileModal };
