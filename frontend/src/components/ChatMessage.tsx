import React from "react";
import type { ChatMessage as ChatMessageType } from "../types/chat";

interface Props {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`my-2 p-3 rounded-lg max-w-lg break-words ${
        isUser
          ? "bg-blue-600 text-white ml-auto text-right"
          : "bg-gray-200 text-black mr-auto text-left"
      }`}
    >
      {message.text}
    </div>
  );
};
