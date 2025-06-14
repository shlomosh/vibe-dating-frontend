import React from 'react';
import { Radar, Zap, SlidersHorizontal, Send, User, Heart, MessageCircle, EyeOff } from 'lucide-react';
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

interface FeedImageProps {
  imageUrls: string[];
  nickName: string;
  profileSummary: string;
  distance: string;
}

export const FeedImage: React.FC<FeedImageProps> = ({ imageUrls, nickName, profileSummary, distance }) => {
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
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <EyeOff className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:opacity-70 transition-opacity">
            <Send className="w-6 h-6" />
          </button>
        </div>
        
        {/* Profile info */}
        <div className="text-sm">
          <div className="font-medium">{nickName}</div>
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
      distance: "500m"
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
      distance: "1km"
    },
    {
      id: 3,
      imageUrls: [
        `https://picsum.photos/800/600?random=5`,
        `https://picsum.photos/800/600?random=6`
      ],
      nickName: generateRandomProfileName(3),
      profileSummary: "51 | Side | Host",
      distance: "1km"
    },
    {
      id: 4,
      imageUrls: [
        `https://picsum.photos/800/600?random=7`,
        `https://picsum.photos/800/600?random=8`
      ],
      nickName: generateRandomProfileName(4),
      profileSummary: "37 | Blower | Travel (20Km)",
      distance: "10km"
    }, 
    {
      id: 5,
      imageUrls: [
      ],
      nickName: generateRandomProfileName(5),
      profileSummary: "28 | Vers Top | Host",
      distance: "15km"
    },   
    {
      id: 6,
      imageUrls: [
        `https://picsum.photos/800/600?random=9`,
      ],
      nickName: generateRandomProfileName(6),
      profileSummary: "31 | Top | Host",
      distance: "11km"
    }
  ];

  const handleNavigationClick = (label: string) => {
    console.log(`Navigation item clicked: ${label}`);
    // Add your navigation logic here
  };

  const navigationItems = [
    { 
      icon: Radar, 
      label: "Radar", 
      isActive: true,
      onClick: () => handleNavigationClick("Radar")
    },
    { 
      icon: SlidersHorizontal, 
      label: "Filters",
      onClick: () => handleNavigationClick("Filters")
    },
    { 
      icon: Heart, 
      label: "Likes",
      onClick: () => handleNavigationClick("Likes")
    },
    { 
      icon: Send, 
      label: "Inbox",
      onClick: () => handleNavigationClick("Inbox")
    },
    { 
      icon: Zap, 
      label: "Feed",
      onClick: () => handleNavigationClick("Feed")
    },
    { 
      icon: User, 
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
            />
          ))}
        </ContentFeed>

        <ContentNavigation items={navigationItems} />
      </Content>
    </Page>
  );
};
