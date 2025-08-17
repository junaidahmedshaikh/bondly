"use client";

const TypingIndicator = ({ avatar }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-end space-x-2">
        <img
          src={avatar || "/placeholder.svg"}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TypingIndicator };
