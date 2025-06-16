import React from 'react';
import { RadarIcon, ZapIcon, SlidersHorizontalIcon, SendIcon, UserIcon, HeartIcon, CircleOffIcon, InboxIcon } from 'lucide-react';
import { Page } from '@/components/Page';
import { Content } from '@/components/Content';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { generateRandomProfileName } from '@/utils/generator';
import { ContentFeed } from '@/components/ContentFeed';
import { ContentNavigation } from '@/components/ContentNavigation';
import anonUserImage from '@/assets/anon-user-front.png';
import { Badge } from "@/components/ui/badge";

interface FeedImageProps {
  imageUrls: string[];
  nickName: string;
  profileSummary: string;
  distance: string;
  lastSeen: number;
}

export const FeedImage: React.FC<FeedImageProps> = ({ imageUrls, nickName, profileSummary, distance, lastSeen }) => {
  return (
    <div className="w-full mb-4 bg-background overflow-hidden">
      
      {/* Image */}
      {imageUrls.length > 0 ? (
        <div className="relative aspect-[3/4] w-full">
          <Swiper
            modules={[Pagination]}
            pagination={{
              clickable: true,
              renderBullet: function (_index, className) {
                return '<span class="' + className + '"></span>';
              },
            }}
            className="w-full h-full rounded-lg"
          >
            {imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={url}
                  alt={nickName}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="relative aspect-[3/1] w-full bg-black/70 rounded-lg">
          <img
            src={anonUserImage}
            alt={nickName}
            className="w-full h-full object-cover opacity-20"
            style={{ objectPosition: "center 80%" }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="p-3 text-foreground">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button className="hover:opacity-70 transition-opacity">
              <HeartIcon className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <CircleOffIcon className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
            <SendIcon className="w-6 h-6" />
          </button>
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
              {lastSeen == 0 ? (
                <Badge variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                  Online
                </Badge>
              ) : (
                <Badge variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
                  {lastSeen >= 60 ? `${Math.floor(lastSeen/60)}h ago` : `${lastSeen}m ago`}
                </Badge>
              )}
            </div>
        </div>
        
        {/* Profile info */}
        <div className="text-sm">
          <div className="flex justify-between items-center">
            <div className="font-medium">{nickName}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-muted-foreground">{profileSummary}</div>
            <div className="text-muted-foreground">{distance}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomePage: React.FC = () => {
  // Mock data for feed images with multiple images per post
  const feedImages = [
    {
      id: 1,
      imageUrls: [`https://picsum.photos/800/600?random=1`],
      nickName: generateRandomProfileName(1),
      profileSummary: "25 | Top | Travel (1Km)",
      distance: "500m",
      lastSeen: 0,
    },
    {
      id: 2,
      imageUrls: [
        `https://picsum.photos/800/600?random=2`,
        `https://picsum.photos/800/600?random=3`,
        `https://picsum.photos/800/600?random=4`
      ],
      nickName: generateRandomProfileName(2),
      profileSummary: "29 | Vers Bottom | Host / Travel (5Km)",
      distance: "1km",
      lastSeen: 0,
    },
    {
      id: 3,
      imageUrls: [
        `https://picsum.photos/800/600?random=5`,
        `https://picsum.photos/800/600?random=6`
      ],
      nickName: generateRandomProfileName(3),
      profileSummary: "51 | Side | Host",
      distance: "1km",
      lastSeen: 10,
    },
    {
      id: 4,
      imageUrls: [
        `https://picsum.photos/800/600?random=7`,
        `https://picsum.photos/800/600?random=8`
      ],
      nickName: generateRandomProfileName(4),
      profileSummary: "37 | Blower | Travel (20Km)",
      distance: "10km",
      lastSeen: 30,
    }, 
    {
      id: 5,
      imageUrls: [
      ],
      nickName: generateRandomProfileName(5),
      profileSummary: "28 | Vers Top | Host",
      distance: "15km",
      lastSeen: 60,
    },   
    {
      id: 6,
      imageUrls: [
        `https://picsum.photos/800/600?random=9`,
      ],
      nickName: generateRandomProfileName(6),
      profileSummary: "31 | Top | Host",
      distance: "11km",
      lastSeen: 120,
    }
  ];

  const handleNavigationClick = (label: string) => {
    console.log(`Navigation item clicked: ${label}`);
    // Add your navigation logic here
  };

  const navigationItems = [
    { 
      icon: RadarIcon, 
      label: "Radar", 
      isActive: true,
      onClick: () => handleNavigationClick("Radar")
    },
    { 
      icon: SlidersHorizontalIcon, 
      label: "Filters",
      onClick: () => handleNavigationClick("Filters")
    },
    { 
      icon: HeartIcon, 
      label: "Likes",
      onClick: () => handleNavigationClick("Likes")
    },
    { 
      icon: InboxIcon, 
      label: "Inbox",
      onClick: () => handleNavigationClick("Inbox")
    },
    { 
      icon: ZapIcon, 
      label: "Feed",
      onClick: () => handleNavigationClick("Feed")
    },
    { 
      icon: UserIcon, 
      label: "Profile",
      onClick: () => handleNavigationClick("Profile")
    }
  ];

  return (
    <Page>
      <Content className="flex flex-col h-full">
        <ContentFeed>
          {feedImages.map((image) => (
            <FeedImage
              key={image.id}
              imageUrls={image.imageUrls}
              nickName={image.nickName}
              profileSummary={image.profileSummary}
              distance={image.distance}
              lastSeen={image.lastSeen}
            />
          ))}
        </ContentFeed>

        <ContentNavigation items={navigationItems} />
      </Content>
    </Page>
  );
};
