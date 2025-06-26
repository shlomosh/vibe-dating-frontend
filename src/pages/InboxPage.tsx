import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { Content } from '@/components/Content';
import { ContentFeed } from '@/components/ContentFeed';
import { LastSeenBadge } from '@/components/LastSeenBadge';
import { MessageCountBadge } from '@/components/MessageCountBadge';
import { InboxNavigationBar } from '@/navigation/InboxNavigationBar';
import { Conversation } from '@/types/chat';
import { formatTimeAgo } from '@/utils/generator';
import { useMockInboxConversations } from '@/mock/inbox';

import anonUserImage from '@/assets/anon-user-front.png';

interface ConversationItemProps {
  conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation
}) => {
  const navigate = useNavigate();
  const { profile, lastMessage, lastTime, unreadCount } = conversation;
  const { profileId, profileInfo, profileImagesUrls } = profile;

  const handleClick = () => {
    navigate(`/chat/${profileId}`);
  };

  const avatarUrl = profileImagesUrls.length > 0 ? profileImagesUrls[0] : undefined;

  return (
    <div
      className="w-full p-2 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-12 rounded-lg overflow-hidden bg-muted">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profileInfo.nickName}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={anonUserImage}
                alt={profileInfo.nickName}
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
                {profileInfo.nickName}
              </div>
              <LastSeenBadge lastSeen={profileInfo.lastSeen} hideIfNotOnline={true} />
            </div>
            <MessageCountBadge count={unreadCount} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground truncate flex-1">
              {lastMessage}
            </div>
            <div className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {formatTimeAgo(lastTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InboxPage: React.FC = () => {
  const conversations = useMockInboxConversations();

  return (
    <Page>
      <Content className="flex flex-col h-full">
        <ContentFeed>
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.profile.profileId}
              conversation={conversation}
            />
          ))}
        </ContentFeed>
        <InboxNavigationBar />
      </Content>
    </Page>
  );
};
