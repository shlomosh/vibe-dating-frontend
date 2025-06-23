import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SendIcon, HeartIcon, CircleOffIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import { Page } from '@/components/Page';
import { Content } from '@/components/Content';
import { ContentFeed } from '@/components/ContentFeed';
import { LastSeenBadge } from '@/components/LastSeenBadge';
import { RadarNavigationBar } from '@/navigation/RadarNavigationBar';
import { FiltersDrawer } from '@/pages/drawers/FiltersDrawer';
import { FiltersDrawerProvider } from '@/contexts/FiltersDrawerContext';
import { useLanguage } from '@/contexts/LanguageContext';

import anonUserImage from '@/assets/anon-user-front.png';
import { mockRadarProfiles } from '@/mock/radar';
import { ProfileRecord } from '@/types/profile';

// Helper function to format distance from meters to readable string
const formatDistance = (distanceMeters: number): string => {
  if (distanceMeters < 1000) {
    // Round to nearest 100m when below 1km
    const roundedMeters = Math.round(distanceMeters / 100) * 100;
    return `${roundedMeters}m`;
  } else {
    // Round to nearest 1km when above 1km
    const roundedKm = Math.round(distanceMeters / 1000);
    return `${roundedKm}km`;
  }
};

interface FeedImageProps {
  profile: ProfileRecord;
}

export const FeedImage: React.FC<FeedImageProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { translations: { profileDict } } = useLanguage();

  const handleSendClick = () => {
    navigate(`/chat/${profile.profileId}`);
  };

  const { profileInfo, profileImagesUrls } = profile;
  const { nickName, age, position, hosting, distance, lastSeen } = profileInfo;

  const profileSummary = (
    <div className="flex gap-1 text-muted-foreground">
      {age && <span>{age}</span>}
      {position && (
        <>
          <span>|</span>
          <span>{profileDict.position.options[position]}</span>
        </>
      )}
      {hosting && (
        <>
          <span>|</span>
          <span>{profileDict.hosting.options[hosting]}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full mb-4 bg-background overflow-hidden">

      {/* Image */}
      {profileImagesUrls.length > 0 ? (
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
            {profileImagesUrls.map((url, index) => (
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
          <div className="flex justify-between items-center">
            {profileSummary}
            <div className="text-muted-foreground">{formatDistance(distance)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RadarPage: React.FC = () => {
  // Get mock radar profiles and sort by distance
  const radarProfiles = mockRadarProfiles(10).sort((a, b) => a.profileInfo.distance - b.profileInfo.distance);

  return (
    <FiltersDrawerProvider>
      <Page>
        <Content className="flex flex-col h-full">
          <ContentFeed>
            {radarProfiles.map((profile) => (
              <FeedImage
                key={profile.profileId}
                profile={profile}
              />
            ))}
          </ContentFeed>
          <RadarNavigationBar />
        </Content>
        <FiltersDrawer />
      </Page>
    </FiltersDrawerProvider>
  );
};
