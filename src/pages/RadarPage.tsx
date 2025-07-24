import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SendIcon, HeartIcon, CircleOffIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { Page } from '@/components/Page';
import { Content } from '@/components/Content';
import { ContentFeed } from '@/components/ContentFeed';
import { LastSeenBadge } from '@/components/LastSeenBadge';
import { RadarNavigationBar } from '@/navigation/RadarNavigationBar';
import { FiltersDrawer } from '@/pages/drawers/FiltersDrawer';
import { FiltersDrawerProvider } from '@/contexts/FiltersDrawerContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PeerProfileRecord } from '@/types/profile';

import { useMockRadarProfiles } from '@/mock/radar';

import anonUserImage from '@/assets/anon-user-front.png';

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

interface UserProfileProps {
  profile: PeerProfileRecord;
}

const UserProfileInfo: React.FC<UserProfileProps> = ({ profile }) => {
  const { translations: { profileDict } } = useLanguage();
  const {
    nickName,
    aboutMe,
    age,
    sexualPosition,
    bodyType,
    eggplantSize,
    peachShape,
    healthPractices,
    hivStatus,
    preventionPractices,
    hosting,
    travelDistance
  } = profile;

  return (
    <div className="w-full h-full p-4 rounded-lg bg-foreground/8 backdrop-blur-sm overflow-y-auto">
      <div className="space-y-3 text-sm">
        {/* Nickname */}
        <div className="flex justify-center items-center">
          <span className="font-semibold">{nickName}</span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <span>{age}</span>
          <span className="text-muted-foreground">{sexualPosition && '|'}</span>
          <span>{sexualPosition && profileDict.sexualPosition.options[sexualPosition]}</span>
          <span className="text-muted-foreground">{hosting && '|'}</span>
          <span>{hosting && profileDict.hosting.options[hosting]} {travelDistance && `(${profileDict.travelDistance.options[travelDistance]})`}</span>
        </div>

        {/* About Me */}
        {aboutMe && (
          <div className="flex flex-col gap-1">
            <span className="w-full text-muted-foreground">{profileDict.aboutMe.label}:</span>
            <span className="w-full">{aboutMe}</span>
          </div>
        )}

        {/* Body Type */}
        {bodyType && (
          <div className="flex justify-between items-center">
            <span className="w-full text-muted-foreground">{profileDict.bodyType.label}:</span>
            <span className="w-full">{profileDict.bodyType.options[bodyType]}</span>
          </div>
        )}

        {/* Health Practices */}
        {healthPractices && (
          <div className="flex justify-between items-center">
            <span className="w-full text-muted-foreground">{profileDict.healthPractices.label}:</span>
            <span className="w-full">{profileDict.healthPractices.options[healthPractices]}</span>
          </div>
        )}

        {/* HIV Status */}
        {hivStatus && (
          <div className="flex justify-between items-center">
            <span className="w-full text-muted-foreground">{profileDict.hivStatus.label}:</span>
            <span className="w-full">{profileDict.hivStatus.options[hivStatus]}</span>
          </div>
        )}

        {/* Prevention Practices */}
        {preventionPractices && (
          <div className="flex justify-between items-center">
            <span className="w-full text-muted-foreground">{profileDict.preventionPractices.label}:</span>
            <span className="w-full">{profileDict.preventionPractices.options[preventionPractices]}</span>
          </div>
        )}

        {/* Eggplant Size */}
        {eggplantSize && (
          <div className="flex justify-between items-center">
            <span className="w-full text-muted-foreground">{profileDict.eggplantSize.label}:</span>
            <span className="w-full">{profileDict.eggplantSize.options[eggplantSize]}</span>
          </div>
        )}

        {/* Peach Shape */}
        {peachShape && (
          <div className="flex justify-between items-center">
            <span className="w-full text-muted-foreground">{profileDict.peachShape.label}:</span>
            <span className="w-full">{profileDict.peachShape.options[peachShape]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const UserProfileCard: React.FC<UserProfileProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { translations: { profileDict } } = useLanguage();

  const handleSendClick = () => {
    navigate(`/chat/${profile.profileId}`);
  };

  const handleSwiperClick = (swiper: SwiperType) => {
    const isLastSlide = swiper.activeIndex === swiper.slides.length - 1;
    if (isLastSlide) {
      swiper.slideTo(0);
    } else {
      swiper.slideTo(swiper.slides.length - 1);
    }
  };

  const { nickName, age, sexualPosition, hosting, distance, lastSeen, profileImages } = profile;

  const profileSummary = (
    <div className="flex gap-1 text-muted-foreground">
      {age && <span>{age}</span>}
      {sexualPosition && (
        <>
          <span>|</span>
          <span>{profileDict.sexualPosition.options[sexualPosition]}</span>
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
      {profileImages.length > 0 ? (
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
            onClick={handleSwiperClick}
          >
            {profileImages.map((image, index) => (
              <SwiperSlide key={index}>
               <img
                  src={image.imageUrl}
                  alt={nickName}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
            <SwiperSlide key="summary">
              <UserProfileInfo profile={profile} />
            </SwiperSlide>
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
  const locale = useLanguage();
  const radarProfiles = useMockRadarProfiles(locale, 10).sort((a, b) => a.distance - b.distance);

  return (
    <FiltersDrawerProvider>
      <Page>
        <Content className="flex flex-col h-full">
          <ContentFeed>
            {radarProfiles.map((profile) => (
              <UserProfileCard
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
