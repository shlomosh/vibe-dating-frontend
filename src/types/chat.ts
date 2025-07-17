import { PeerProfileRecord } from './profile';

export interface Message {
  id: number;
  text: string;
  isMe: boolean;
  timestamp: Date;
}

export interface Conversation {
  profile: PeerProfileRecord; // peer-profile-record with lastSeen
  lastMessage: string; // last message (as string)
  lastTime: number; // last time (as unix timestamp)
  unreadCount: number; // number of unread messages
}
