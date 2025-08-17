"use client";

import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { SwipeCard } from "../components/matching/SwipeCard";
import { MatchModal } from "../components/matching/MatchModel";
import { Button } from "../components/ui/Button";

const mockProfiles = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 26,
    location: "New York, NY",
    bio: "Love traveling and trying new restaurants. Looking for someone to explore the city with!",
    photos: ["/profile-photo-1.png", "/profile-photo-2.png"],
    interests: ["Travel", "Food", "Photography", "Music"],
    distance: "2 miles away",
  },
  {
    id: 2,
    name: "Emily Chen",
    age: 24,
    location: "Brooklyn, NY",
    bio: "Artist and coffee enthusiast. Let's grab a latte and talk about life!",
    photos: ["/profile-photo-2.png", "/diverse-user-avatars.png"],
    interests: ["Art", "Coffee", "Reading", "Yoga"],
    distance: "5 miles away",
  },
  {
    id: 3,
    name: "Jessica Williams",
    age: 29,
    location: "Manhattan, NY",
    bio: "Fitness lover and weekend hiker. Always up for an adventure!",
    photos: ["/diverse-user-avatars.png", "/profile-photo-1.png"],
    interests: ["Fitness", "Hiking", "Nature", "Cooking"],
    distance: "3 miles away",
  },
  {
    id: 4,
    name: "Amanda Rodriguez",
    age: 27,
    location: "Queens, NY",
    bio: "Tech professional who loves gaming and sci-fi movies. Let's geek out together!",
    photos: ["/profile-photo-1.png"],
    interests: ["Technology", "Gaming", "Movies", "Music"],
    distance: "7 miles away",
  },
];

const Discover = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  const handleSwipe = (direction, profileId) => {
    if (direction === "right") {
      // Simulate match (30% chance)
      if (Math.random() > 0.7) {
        const profile = profiles.find((p) => p.id === profileId);
        setMatchedProfile(profile);
        setShowMatchModal(true);
      }
    }

    // Move to next profile
    setCurrentIndex((prev) => prev + 1);
  };

  const handleLike = () => {
    if (currentIndex < profiles.length) {
      handleSwipe("right", profiles[currentIndex].id);
    }
  };

  const handlePass = () => {
    if (currentIndex < profiles.length) {
      handleSwipe("left", profiles[currentIndex].id);
    }
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentProfile = profiles[currentIndex];

  if (currentIndex >= profiles.length) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            You're all caught up!
          </h2>
          <p className="text-gray-600 mb-6">
            Check back later for more potential matches.
          </p>
          <Button
            onClick={() => {
              setCurrentIndex(0);
              setProfiles([...mockProfiles]);
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Start Over
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover</h1>
          <p className="text-gray-600">
            {profiles.length - currentIndex} people nearby
          </p>
        </div>

        {currentProfile && (
          <div className="relative">
            <SwipeCard profile={currentProfile} onSwipe={handleSwipe} />

            {/* Action buttons */}
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRewind}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl"
              >
                <span className="text-xl">↶</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handlePass}
                className="w-16 h-16 rounded-full bg-white shadow-lg hover:shadow-xl border-red-200 hover:border-red-300"
              >
                <span className="text-2xl">✕</span>
              </Button>

              <Button
                size="icon"
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
              >
                <span className="text-2xl text-white">❤️</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-blue-200 hover:border-blue-300"
              >
                <span className="text-xl">⭐</span>
              </Button>
            </div>
          </div>
        )}

        {/* Match Modal */}
        {showMatchModal && matchedProfile && (
          <MatchModal
            profile={matchedProfile}
            onClose={() => setShowMatchModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Discover;
