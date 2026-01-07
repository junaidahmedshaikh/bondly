"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { INTERESTS, BACKEND_URL } from "../utils/constant";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";
import { updateUser } from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    bio: "",
    interests: [],
  });

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      // Fallback to Redux user if available
      if (currentUser) {
        setUser(currentUser);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Fetch user profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        age: user?.age || "",
        location: user?.location || "",
        bio: user?.bio || "",
        interests: user?.interests || [],
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      toast.error("Please enter a valid age (18-100)");
      return;
    }

    if (!formData.location || !formData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    if (formData.bio && formData.bio.length > 50) {
      toast.error("Bio must be 50 characters or less");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch(`${BACKEND_URL}/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          age: Number(formData.age),
          location: formData.location.trim(),
          bio: formData.bio.trim(),
          interests: formData.interests,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await res.json();
      setUser(data.user);
      dispatch(updateUser(data.user));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      age: user?.age || "",
      location: user?.location || "",
      bio: user?.bio || "",
      interests: user?.interests || [],
    });
    setIsEditing(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/diverse-user-avatars.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <img
                  src={getImageUrl(
                    user?.profileImages?.[0] || user?.profileURL
                  )}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-200"
                  onError={(e) => {
                    e.target.src = "/diverse-user-avatars.png";
                  }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.name}, {user?.age}
                </h1>
                <p className="text-gray-600 mb-4">{user?.location}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {user?.interests?.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                  {user?.interests?.length > 3 && (
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      +{user.interests.length - 3} more
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => {
                    if (isEditing) {
                      handleCancel();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, State"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <p className="text-gray-900">{user?.age}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <p className="text-gray-900">{user?.location}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* About Me */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                <p className="text-gray-900">
                  {user?.bio || "No bio added yet."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 text-xs rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                      formData.interests.includes(interest)
                        ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.interests?.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {(!user?.interests || user.interests.length === 0) && (
                  <p className="text-gray-500 text-sm">
                    No interests added yet.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save/Cancel buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
