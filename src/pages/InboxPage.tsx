import React from 'react';
import { Page } from '@/components/Page';
import { Content } from '@/components/Content';
import { generateRandomProfileName } from '@/utils/generator';
import { ContentFeed } from '@/components/ContentFeed';
import { MainNavigationBar } from '@/navigation/MainNavigationBar';
import { LastSeenBadge } from '@/components/LastSeenBadge';
import anonUserImage from '@/assets/anon-user-front.png';

interface ConversationItemProps {
  username: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  lastSeen: number;
  avatarUrl?: string;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ 
  username, 
  lastMessage, 
  lastTime, 
  unreadCount, 
  lastSeen,
  avatarUrl 
}) => {
  return (
    <div className="w-full p-2 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-12 rounded-lg overflow-hidden bg-muted">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={anonUserImage}
                alt={username}
                className="w-full h-full object-cover opacity-60"
              />
            )}
          </div>
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-foreground truncate">
                {username}
              </div>
              {unreadCount > 0 && (
                <div className="flex-shrink-0">
                  <div className="bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              <LastSeenBadge lastSeen={lastSeen} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground truncate flex-1">
              {lastMessage}
            </div>
            <div className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {lastTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InboxPage: React.FC = () => {
  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      username: generateRandomProfileName(1),
      lastMessage: "Hey! How are you doing? 😊",
      lastTime: "2m",
      lastSeen: 0,
      unreadCount: 3,
      avatarUrl: `https://picsum.photos/100/100?random=1`
    },
    {
      id: 2,
      username: generateRandomProfileName(2),
      lastMessage: "Thanks for the message!",
      lastTime: "5m",
      lastSeen: 5,
      unreadCount: 0,
      avatarUrl: `https://picsum.photos/100/100?random=2`
    },
    {
      id: 3,
      username: generateRandomProfileName(3),
      lastMessage: "Are you free this weekend?",
      lastTime: "12m",
      lastSeen: 15,
      unreadCount: 1,
      avatarUrl: `https://picsum.photos/100/100?random=3`
    },
    {
      id: 4,
      username: generateRandomProfileName(4),
      lastMessage: "That sounds great! Let's meet up",
      lastTime: "1h",
      lastSeen: 45,
      unreadCount: 0,
      avatarUrl: `https://picsum.photos/100/100?random=4`
    },
    {
      id: 5,
      username: generateRandomProfileName(5),
      lastMessage: "I had a really good time last night",
      lastTime: "2h",
      lastSeen: 90,
      unreadCount: 5,
      avatarUrl: `https://picsum.photos/100/100?random=5`
    },
    {
      id: 6,
      username: generateRandomProfileName(6),
      lastMessage: "Can't wait to see you again!",
      lastTime: "3h",
      lastSeen: 120,
      unreadCount: 0,
      avatarUrl: `https://picsum.photos/100/100?random=6`
    },
    {
      id: 7,
      username: generateRandomProfileName(7),
      lastMessage: "What are your plans for tonight?",
      lastTime: "5h",
      lastSeen: 180,
      unreadCount: 2,
      avatarUrl: `https://picsum.photos/100/100?random=7`
    },
    {
      id: 8,
      username: generateRandomProfileName(8),
      lastMessage: "Thanks for the great conversation",
      lastTime: "1d",
      lastSeen: 1440,
      unreadCount: 0,
      avatarUrl: `https://picsum.photos/100/100?random=8`
    },
    {
      id: 9,
      username: generateRandomProfileName(9),
      lastMessage: "Hope you're having a good day!",
      lastTime: "2d",
      lastSeen: 2880,
      unreadCount: 0,
      avatarUrl: `https://picsum.photos/100/100?random=9`
    },
    {
      id: 10,
      username: generateRandomProfileName(10),
      lastMessage: "Let's catch up soon!",
      lastTime: "3d",
      lastSeen: 4320,
      unreadCount: 1,
      avatarUrl: `https://picsum.photos/100/100?random=10`
    }
  ];

  return (
    <Page>
      <Content className="flex flex-col h-full">
        <ContentFeed>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              username={conversation.username}
              lastMessage={conversation.lastMessage}
              lastTime={conversation.lastTime}
              lastSeen={conversation.lastSeen}
              unreadCount={conversation.unreadCount}
              avatarUrl={conversation.avatarUrl}
            />
          ))}
        </ContentFeed>

        <MainNavigationBar />
      </Content>
    </Page>
  );
}; 