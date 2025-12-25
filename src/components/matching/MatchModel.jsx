"use client";

import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

const MatchModal = ({ profile, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            It's a Match!
          </h2>
          <p className="text-gray-600 mb-6">
            You and {profile.name} liked each other
          </p>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <img
              src="/diverse-user-avatars.png"
              alt="You"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="text-2xl text-pink-500">❤️</div>
            <img
              src={profile.profileURL[0] || "/placeholder.svg"}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={() => {
                onClose();
                // Navigate to messages would go here
              }}
            >
              Send Message
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={onClose}
            >
              Keep Swiping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { MatchModal };
