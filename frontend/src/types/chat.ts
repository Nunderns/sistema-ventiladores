export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
}