import React from 'react';
import { Home, Zap, Search, Send, Users, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Page } from '@/components/Page';
import { Content } from '@/components/Content';

interface FeedImageProps {
  imageUrl: string;
  username: string;
  likes: number;
  comments: number;
}

const FeedImage: React.FC<FeedImageProps> = ({ imageUrl, username, likes, comments }) => {
  return (
    <div className="w-full mb-4 bg-background rounded-lg overflow-hidden">
      {/* User info header */}
      <div className="flex items-center p-3 gap-2">
        <img
          src={`https://picsum.photos/32/32?random=${username}`}
          alt={username}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium text-sm">{username}</span>
      </div>
      
      {/* Image */}
      <div className="relative aspect-[2/3] w-full">
        <img
          src={imageUrl}
          alt={username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Action buttons */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button className="hover:opacity-70 transition-opacity">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:opacity-70 transition-opacity">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>
        
        {/* Likes and comments count */}
        <div className="text-sm">
          <div className="font-medium">{likes.toLocaleString()} likes</div>
          <div className="text-muted-foreground">{comments} comments</div>
        </div>
      </div>
    </div>
  );
};

const NavigationItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}> = ({ icon, label, isActive }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        "p-2 rounded-full transition-colors",
        isActive ? "border-2 border-primary text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs",
        isActive ? "text-primary" : "text-muted-foreground"
      )}>{label}</span>
    </div>
  );
};

export const GridPage: React.FC = () => {
  // Mock data for feed images
  const feedImages = Array(10).fill(null).map((_, index) => ({
    id: index,
    imageUrl: `https://picsum.photos/800/600?random=${index}`,
    username: `user_${index + 1}`,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100)
  }));

  return (
    <Page>
      <Content className="flex flex-col h-full">
        {/* Main Feed Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-16">
          <div className="max-w-lg mx-auto px-4 py-4">
            {feedImages.map((image) => (
              <FeedImage
                key={image.id}
                imageUrl={image.imageUrl}
                username={image.username}
                likes={image.likes}
                comments={image.comments}
              />
            ))}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around p-4 border-t bg-background z-50">
          <NavigationItem icon={<Home size={24} />} label="Home" isActive />
          <NavigationItem icon={<Search size={24} />} label="Filters" />
          <NavigationItem icon={<Zap size={24} />} label="Flash" />
          <NavigationItem icon={<Send size={24} />} label="Inbox" />
          <NavigationItem icon={<Users size={24} />} label="Feed" />
          <NavigationItem 
            icon={
              <img
                src="https://picsum.photos/32/32"
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
            } 
            label="Profile" 
          />
        </nav>
      </Content>
    </Page>
  );
};
