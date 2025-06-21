import { Message } from '@/types/chat';

export const mockChatMessages: Message[] = [
  {
    id: 1,
    text: "Hey! How are you doing? 😊",
    isMe: false,
    timestamp: new Date(Date.now() - 300000) // 5 minutes ago
  },
  {
    id: 2,
    text: "Hi! I'm doing great, thanks for asking! How about you?",
    isMe: true,
    timestamp: new Date(Date.now() - 240000) // 4 minutes ago
  },
  {
    id: 3,
    text: "Pretty good! Are you free this weekend?",
    isMe: false,
    timestamp: new Date(Date.now() - 180000) // 3 minutes ago
  },
  {
    id: 4,
    text: "Yes, I should be free! What did you have in mind?",
    isMe: true,
    timestamp: new Date(Date.now() - 120000) // 2 minutes ago
  },
  {
    id: 5,
    text: "I was thinking we could grab coffee or something?",
    isMe: false,
    timestamp: new Date(Date.now() - 60000) // 1 minute ago
  }
];

export const mockChatReplies = [
  "That sounds great!",
  "Thanks for the message!",
  "I'll get back to you soon!",
  "Interesting! Tell me more.",
  "👍",
  "Sure thing!"
];
