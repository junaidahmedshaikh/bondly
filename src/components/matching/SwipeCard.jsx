"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/Card";

const SwipeCard = ({ profile, onSwipe }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNextPhoto = () => {
    if (currentPhotoIndex < profile.photos.length - 1) {
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
        onSwipe(direction, profile.id);
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
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={cardStyle}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        {/* Photo */}
        <div className="relative h-96 bg-gray-200">
          <img
            src={profile.photos[currentPhotoIndex] || "/placeholder.svg"}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Photo navigation */}
          {profile.photos.length > 1 && (
            <>
              <div className="absolute top-4 left-0 right-0 flex justify-center space-x-1">
                {profile.photos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full ${
                      index === currentPhotoIndex
                        ? "bg-white w-8"
                        : "bg-white/50 w-4"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40"
              >
                ‹
              </button>

              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40"
              >
                ›
              </button>
            </>
          )}

          {/* Distance */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {profile.distance}
          </div>
        </div>

        {/* Profile info */}
        <CardContent className="p-4">
          <div className="mb-3">
            <h2 className="text-xl font-bold text-gray-900">
              {profile.name}, {profile.age}
            </h2>
            <p className="text-gray-600 text-sm">{profile.location}</p>
          </div>

          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-1">
            {profile.interests.slice(0, 4).map((interest) => (
              <span
                key={interest}
                className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{profile.interests.length - 4}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Swipe indicators */}
      {isDragging && (
        <>
          {dragOffset.x > 50 && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl transform rotate-12">
                LIKE
              </div>
            </div>
          )}
          {dragOffset.x < -50 && (
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xl transform -rotate-12">
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
