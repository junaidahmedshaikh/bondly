"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/Card";
import { BACKEND_BASE_URL } from "../../utils/constant";

const SwipeCard = ({ profile, onSwipe }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Safe access to profileImages with fallback
  const profilePhotos = profile?.profileImages || [];
  const hasPhotos = profilePhotos.length > 0;

  // Build full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("/")) {
      return `${BACKEND_BASE_URL}${imagePath}`;
    }
    return imagePath;
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < profilePhotos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setDragOffset({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      // Determine swipe direction
      if (Math.abs(dragOffset.x) > 100) {
        const direction = dragOffset.x > 0 ? "right" : "left";
        onSwipe(direction, profile._id || profile.id);
      }

      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const cardStyle = {
    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${
      dragOffset.x * 0.1
    }deg)`,
    transition: isDragging ? "none" : "transform 0.3s ease-out",
  };

  return (
    <Card
      className="relative overflow-hidden shadow-none cursor-grab active:cursor-grabbing select-none border-0 bg-white"
      style={cardStyle}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        {/* Photo */}
        <div className="relative h-[400px] bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={getImageUrl(profilePhotos[currentPhotoIndex])}
            alt={profile?.name || "Profile"}
            className="w-full h-full object-cover"
            draggable={false}
            onError={(e) => {
              console.error(
                "Image failed to load:",
                profilePhotos[currentPhotoIndex]
              );
              e.target.src = "/placeholder.svg";
            }}
          />

          {/* Gradient overlay for better text visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

          {/* Photo navigation */}
          {hasPhotos && (
            <>
              <div className="absolute top-4 left-0 right-0 flex justify-center space-x-1.5 z-10">
                {profilePhotos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentPhotoIndex
                        ? "bg-white w-10 "
                        : "bg-white/60 w-4 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 z-10 shadow-md"
                aria-label="Previous photo"
              >
                <span className="text-xl font-bold">‹</span>
              </button>

              <button
                onClick={handleNextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 z-10 shadow-md"
                aria-label="Next photo"
              >
                <span className="text-xl font-bold">›</span>
              </button>
            </>
          )}

          {/* Profile info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profile?.name || "Unknown"}, {profile?.age || "?"}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-white/90 text-sm font-medium">
                    {profile?.location || "Unknown location"}
                  </p>
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
                    {profile?.distance || "Nearby"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500  tracking-wide mb-2">
              About
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {profile?.bio || "No bio available"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wide mb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.interests || []).slice(0, 5).map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-100"
                >
                  {interest}
                </span>
              ))}
              {(profile?.interests || []).length > 5 && (
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                  +{(profile?.interests || []).length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Photo counter */}
          {/* {hasPhotos && profilePhotos.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Photo {currentPhotoIndex + 1} of {profilePhotos.length}
              </p>
            </div>
          )} */}
        </CardContent>
      </div>

      {/* Swipe indicators */}
      {isDragging && (
        <>
          {dragOffset.x > 50 && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/15 to-green-400/15 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-7 py-3 rounded-xl font-bold text-xl md:text-2xl transform rotate-12 shadow-xl">
                LIKE
              </div>
            </div>
          )}
          {dragOffset.x < -50 && (
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/15 to-red-400/15 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl">
              <div className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-7 py-3 rounded-xl font-bold text-xl md:text-2xl transform -rotate-12 shadow-xl">
                PASS
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export { SwipeCard };
