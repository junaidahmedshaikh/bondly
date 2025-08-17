"use client";

const MessageBubble = ({ message, isOwn, senderAvatar }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex ${
          isOwn ? "flex-row-reverse" : "flex-row"
        } items-end space-x-2 max-w-xs lg:max-w-md`}
      >
        {!isOwn && (
          <img
            src={senderAvatar || "/placeholder.svg"}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
      <div
        className={`text-xs text-gray-500 mt-1 ${
          isOwn ? "text-right mr-2" : "text-left ml-2"
        }`}
      >
        {message.timestamp}
      </div>
    </div>
  );
};

export { MessageBubble };
