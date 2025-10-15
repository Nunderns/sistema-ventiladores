import React, { useState } from "react";
import { api } from "../api/api";
import type { ChatMessage } from "../types/chat";
import { ChatMessage as ChatMessageComponent } from "../components/ChatMessage";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage: ChatMessage = { role: "user", text: input };
  setMessages(prev => [...prev, userMessage]);
  setInput("");

  try {
    const response = await api.post("/chat", { question: input });
    const botMessage: ChatMessage = { 
      role: "bot", 
      text: response.data.answer || "No response from server" 
    };
    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    const errorMessage: ChatMessage = { 
      role: "bot", 
      text: "Erro ao processar sua mensagem. Por favor, tente novamente." 
    };
    setMessages(prev => [...prev, errorMessage]);
  }
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Mensagens */}
      <div className="flex-1 p-4 overflow-auto">
        {messages.map((message, index) => (
          <ChatMessageComponent key={index} message={message} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex border-t bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre a fábrica..."
          className="flex-1 border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
