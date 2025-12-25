"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { SwipeCard } from "../components/matching/SwipeCard";
import { MatchModal } from "../components/matching/MatchModel";
import { Button } from "../components/ui/Button";
import { BACKEND_BASE_URL } from "../utils/constant";
import { useSelector } from "react-redux";

const Discover = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [startAgain, setStartAgain] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await fetch(`${BACKEND_BASE_URL}/discover`, {
        credentials: "include",
      });
      const data = await res.json();
      // console.log(data);
      setProfiles(data.users);
    };
    fetchProfiles();
  }, [startAgain]);
  const handleSwipe = (direction, profileId) => {
    if (direction === "right") {
      if (Math.random() > 0.7) {
        const profile = profiles.find((p) => p.id === profileId);
        setMatchedProfile(profile);
        setShowMatchModal(true);
      }
    }

    // Move to next profile
    setCurrentIndex((prev) => prev + 1);
  };

  const handleLike = async () => {
    if (currentIndex < profiles.length) {
      handleSwipe("right", profiles[currentIndex].id);
    }

    // console.log("Liked profile:", profiles[0]);
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/request/send/interested/${profiles[currentIndex]?._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      console.log("Like recorded:", res.ok);
    } catch (error) {
      console.error("Error recording like:", error);
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
              setStartAgain((prev) => !prev);
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
        <div className="text-center content flex-col justify-center items-center mb-6">
          <span className="text-2xl font-bold text-gray-900 mb-2 pr-2">
            Discover
          </span>
          <span className="text-gray-600">
            {profiles.length - currentIndex} people nearby
          </span>
        </div>

        {currentProfile && (
          <div className="relative bg-white pb-6 shadow-lg rounded-lg">
            <SwipeCard profile={currentProfile} onSwipe={handleSwipe} />

            {/* Action buttons */}
            <div className="flex justify-center items-center space-x-3 md:space-x-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRewind}
                disabled={currentIndex === 0}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label="Rewind"
              >
                <span className="text-xl">↶</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handlePass}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-md hover:shadow-lg border-red-200 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                aria-label="Pass"
              >
                <span className="text-2xl">✕</span>
              </Button>

              <Button
                size="icon"
                onClick={handleLike}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                aria-label="Like"
              >
                <span className="text-2xl text-white">❤️</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-md hover:shadow-lg border-blue-200 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="Super like"
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
