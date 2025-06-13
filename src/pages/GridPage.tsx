import React from 'react';
import { Grid, Zap, Inbox, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Page } from '@/components/Page';
import { Content } from '@/components/Content';

interface GridImageProps {
  imageUrl: string;
  username: string;
}

const GridImage: React.FC<GridImageProps> = ({ imageUrl, username }) => {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={username}
        className="h-full w-full object-cover"
      />
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
        "p-2 rounded-full",
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
};

export const GridPage: React.FC = () => {
  // Mock data for grid images
  const gridImages = Array(18).fill(null).map((_, index) => ({
    id: index,
    imageUrl: `https://picsum.photos/400/600?random=${index}`,
    username: `User ${index + 1}`
  }));

  return (
    <Page>
      <Content className="flex flex-col h-full">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 border-b">
          <div className="relative">
            <img
              src="https://picsum.photos/40/40"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M21 6H3" />
              <path d="M21 12H3" />
              <path d="M21 18H3" />
            </svg>
          </button>
        </header>

        {/* Main Grid Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="grid grid-cols-3 gap-1">
            {gridImages.map((image) => (
              <GridImage
                key={image.id}
                imageUrl={image.imageUrl}
                username={image.username}
              />
            ))}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="flex items-center justify-around p-4 border-t bg-background">
          <NavigationItem icon={<Grid size={24} />} label="Grid" isActive />
          <NavigationItem icon={<Zap size={24} />} label="Flash" />
          <NavigationItem icon={<Inbox size={24} />} label="Inbox" />
          <NavigationItem icon={<Users size={24} />} label="Feed" />
        </nav>
      </Content>
    </Page>
  );
};
