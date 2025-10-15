import React, { useState, useRef, useEffect } from "react";
import api from "../api/api";
import type { ChatMessage } from "../types/chat";
import { ChatMessage as ChatMessageComponent } from "../components/ChatMessage";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll para o final quando as mensagens mudarem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    return () => {
      // Cancela requisição pendente ao desmontar o componente
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Cria um novo AbortController para esta requisição
    abortControllerRef.current = new AbortController();

    try {
      const response = await api.post(
        "/chat",
        { question: input },
        { signal: abortControllerRef.current.signal }
      );

      const botMessage: ChatMessage = {
        role: "bot",
        text:
          response.data.answer ||
          "Desculpe, não consegui processar sua mensagem.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      const isCancelError = error && 
        typeof error === 'object' && 
        'name' in error && 
        (error.name === "CanceledError" || 
         error.name === "AbortError" ||
         ('message' in error && typeof error.message === 'string' && error.message.includes("cancel")));

      if (!isCancelError) {
        console.error("Erro ao enviar mensagem:", error);
        const errorMessage: ChatMessage = {
          role: "bot",
          text: "Erro ao processar sua mensagem. Por favor, tente novamente.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50">
      {/* Container de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-xl">Bem-vindo ao Chat da Fábrica</p>
              <p className="mt-2">Como posso ajudar você hoje?</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessageComponent
              key={`${message.role}-${index}`}
              message={message}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
              disabled={isLoading || input.trim().length === 0}
            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
