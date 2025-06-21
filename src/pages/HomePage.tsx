import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SendIcon, HeartIcon, CircleOffIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import { Page } from '@/components/Page';
import { Content } from '@/components/Content';
import { ContentFeed } from '@/components/ContentFeed';
import { LastSeenBadge } from '@/components/LastSeenBadge';
import { HomeNavigationBar } from '@/navigation/HomeNavigationBar';
import { FiltersDrawer } from '@/pages/drawers/FiltersDrawer';
import { FiltersDrawerProvider } from '@/contexts/FiltersDrawerContext';
import { generateRandomProfileName } from '@/utils/generator';

import anonUserImage from '@/assets/anon-user-front.png';

interface FeedImageProps {
  id: number;
  imageUrls: string[];
  nickName: string;
  profileSummary: string;
  distance: string;
  lastSeen: number;
}

export const FeedImage: React.FC<FeedImageProps> = ({ id, imageUrls, nickName, profileSummary, distance, lastSeen }) => {
  const navigate = useNavigate();

  const handleSendClick = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="w-full mb-4 bg-background overflow-hidden">
      
      {/* Image */}
      {imageUrls.length > 0 ? (
        <div className="relative aspect-[3/4] w-full swiper-container">
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
            <button 
              className="hover:opacity-70 transition-opacity"
              onClick={handleSendClick}
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
            <LastSeenBadge lastSeen={lastSeen} />
          </div>
        </div>
        
        {/* Profile info */}
        <div className="text-sm">
          <div className="flex justify-between items-center font-medium">
            <div>{nickName}</div>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <div>{profileSummary}</div>
            <div>{distance}</div>
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

  return (
    <FiltersDrawerProvider>
      <Page>
        <Content className="flex flex-col h-full">
          <ContentFeed>
            {feedImages.map((image) => (
              <FeedImage
                key={image.id}
                id={image.id}
                imageUrls={image.imageUrls}
                nickName={image.nickName}
                profileSummary={image.profileSummary}
                distance={image.distance}
                lastSeen={image.lastSeen}
              />
            ))}
          </ContentFeed>
          <HomeNavigationBar />
        </Content>
        <FiltersDrawer />
      </Page>
    </FiltersDrawerProvider>
  );
};
