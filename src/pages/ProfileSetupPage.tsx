import type { FC, ReactNode } from 'react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PlusIcon, TrashIcon, LocateFixedIcon } from 'lucide-react';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { ContentFeed } from '@/components/ContentFeed';
import { TextEditor } from '@/components/TextEditor';
import { ImageEditor } from '@/components/ImageEditor';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { ProfileId, SelfProfileRecord } from '@/types/profile';
import { cn } from '@/lib/utils';
import { getRandomOffset } from '@/utils/location';
import { ProfileNavigationBar } from '../navigation/ProfileNavigationBar';
import { Location } from '@/types/location';
import { mediaApi } from '@/api/media';


const ProfileSelect: FC<{ selectCfg: { label?: string | ReactNode, options: any }, className?: string, enableClearOption?: boolean, disabled?: boolean, value?: string, onValueChange?: (value: string) => void }> = ({ selectCfg, className = "", enableClearOption = true, disabled = false, value = '--', onValueChange }) => {
  const emptyValue = '--';

  return (
    <div className={cn(className, "text-sm")}>
      <Select disabled={disabled} value={value} onValueChange={onValueChange}>
        {selectCfg.label && <span className="px-1">{selectCfg.label}</span>}
        <SelectTrigger className="w-full">
          <SelectValue placeholder={emptyValue} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{selectCfg.label}</SelectLabel>
            {enableClearOption ? (<SelectItem className="italic" key={emptyValue} value={emptyValue}>{emptyValue}</SelectItem>) : null}
            {
              Object.keys(selectCfg.options).map((value) => (
                <SelectItem key={value} value={value}>{selectCfg.options[value]}</SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
};

const ProfileAlbumCarousel = React.memo(({ onAlbumEdit }: { onAlbumEdit?: () => void }) => {
  const [images, setImages] = useState<string[]>([]);
  const [imageIds, setImageIds] = useState<string[]>([]); // Store backend media IDs
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { translations: { globalDict } } = useLanguage();
  const [exif, setExif] = useState(undefined);
  const { profileDB } = useProfile();



  // Load existing images from backend when profile changes
  useEffect(() => {
    const loadBackendImages = async () => {
      if (profileDB?.activeProfileId) {
        try {
          const existingMedia = await mediaApi.getProfileMedia(profileDB.activeProfileId);
          const imageMedia = existingMedia.filter(media => media.mediaType === 'image');

          setImages(imageMedia.map(media => media.url));
          setImageIds(imageMedia.map(media => media.mediaId));
        } catch (error) {
          console.error('Failed to load existing images:', error);
          // Keep existing images if loading fails
        }
      }
    };

    loadBackendImages();
  }, [profileDB?.activeProfileId]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickPercentage = (clickY / rect.height) * 100;

    if (clickPercentage <= 75) {
      if (onAlbumEdit) {
        onAlbumEdit();
      }
      setIsAlbumDialogOpen(true);
    }
  };

  const handleDeleteImage = async () => {
    if (images.length > 0 && imageIds.length > 0) {
      const currentImageId = imageIds[currentSlideIndex];

      try {
        setIsDeleting(true);

        // Delete from backend if we have a media ID
        if (currentImageId && profileDB?.activeProfileId) {
          await mediaApi.deleteMedia(profileDB.activeProfileId, currentImageId);
        }

        // Remove from local state
        const newImages = [...images];
        const newImageIds = [...imageIds];
        newImages.splice(currentSlideIndex, 1);
        newImageIds.splice(currentSlideIndex, 1);

        setImages(newImages);
        setImageIds(newImageIds);

        // Reset current slide index if we're at the end
        if (currentSlideIndex >= newImages.length) {
          setCurrentSlideIndex(Math.max(0, newImages.length - 1));
        }
      } catch (error) {
        console.error('Failed to delete image:', error);
        // You might want to show an error message to the user here
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleAddImage = async (croppedImage: string, exif: any) => {
    console.log('handleAddImage', croppedImage, exif);
    setExif(exif);

    try {
      setIsUploading(true);

      // Convert base64 data URL to File object for upload
      const base64Response = await fetch(croppedImage);
      const blob = await base64Response.blob();
      const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });

      // Upload to backend if we have an active profile
      if (profileDB?.activeProfileId) {
        const uploadResult = await mediaApi.uploadMedia(profileDB.activeProfileId, file, { exif: exif });

        // Add to local state with backend media ID
        setImages([...images, croppedImage]);
        setImageIds([...imageIds, uploadResult.mediaId]);

        console.log('Image uploaded successfully:', uploadResult);
      } else {
        // Fallback to local state only if no active profile
        setImages([...images, croppedImage]);
        setImageIds([...imageIds, '']);
        console.warn('No active profile ID, image saved locally only');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      // You might want to show an error message to the user here
      // For now, we'll still add the image locally so the user doesn't lose their work
      setImages([...images, croppedImage]);
      setImageIds([...imageIds, '']);
    } finally {
      setIsUploading(false);
    }
  };

  const CarouselContent = () => {
    const swiperRef = React.useRef<any>(null);

    return (
      <div className="relative aspect-[3/4] w-full swiper-container">
        <div className="hidden">
        <pre className="text-xs overflow-auto h-[200px] overflow-y-scroll">
          {exif ? JSON.stringify(exif, null, 2) : 'No EXIF data'}
          </pre>
        </div>
        <Swiper
          modules={[Pagination]}
          grabCursor={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          pagination={{
            clickable: true,
            renderBullet: function (_index, className) {
              return '<span class="' + className + '"></span>';
            },
          }}
          className="w-full h-full rounded-lg"
        >
          {images.length > 0 ? images.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex w-full h-full relative">
                <img
                  src={item}
                  alt={`Profile Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{
                    minWidth: "100%",
                    minHeight: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                {index === 0 && (
                  <div className="absolute bottom-[1.25rem] right-[1.25rem] z-10">
                    <Badge variant="secondary" className="h-[1.5rem]">
                      {globalDict.profileImage}
                    </Badge>
                  </div>
                )}
                {/* Show loading overlay during operations */}
                {(isUploading || isDeleting) && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          )) : (
            <SwiperSlide className="flex items-center justify-center">
              <div className="flex w-full h-full items-center justify-center">
                {(isAlbumDialogOpen) ? (<>{globalDict.noImagesOnAlbum}</>) : (<>{globalDict.clickToEditAlbum}</>)}
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    );
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        <CarouselContent />
      </div>
      <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
        <DialogContent className="w-auto h-auto p-0 border-2 border border-white rounded-[2%] w-[85vw]">
          <DialogHeader className="hidden">
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <div className="w-full aspect-[3/4]">
            <CarouselContent />
            <div className="absolute top-[100%] pb-16 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="flex gap-2">
                <TrashIcon
                  className={
                    `w-10 h-10 rounded-[8px] p-2 border-2 bg-black/50 ${images.length == 0 || isDeleting
                      ? "text-white/50 border-white/10 cursor-not-allowed"
                      : "text-white border-white/20 hover:border-white/50"
                    }`}
                  onClick={handleDeleteImage}
                  style={{ cursor: images.length == 0 || isDeleting ? 'not-allowed' : 'pointer' }}
                />
                <PlusIcon
                  className={
                    `w-10 h-10 rounded-[8px] p-2 border-2 bg-black/50 ${images.length >= 5 || isUploading
                      ? "text-white/50 border-white/10 cursor-not-allowed"
                      : "text-white border-white/20 hover:border-white/50"
                    }`}
                  onClick={() => {
                    if (images.length < 5 && !isUploading) {
                      setIsImageEditorOpen(true);
                    }
                  }}
                  style={{ cursor: images.length >= 5 || isUploading ? 'not-allowed' : 'pointer' }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isImageEditorOpen} onOpenChange={setIsImageEditorOpen}>
        <DialogContent className="w-auto h-auto p-0 border-2 border border-white rounded-[2%] w-[85vw]">
          <DialogHeader className="hidden">
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <div className="w-full aspect-[3/4]">
            <ImageEditor
              onClose={() => setIsImageEditorOpen(false)}
              onImageSave={handleAddImage}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

const CreateProfileDialog: FC<{
  onClose?: () => void,
  onSubmit?: (newProfileId: string) => void,
  disabled?: boolean
}> = ({ onClose, onSubmit, disabled = false }) => {
  const [newProfileName, setNewProfileName] = useState<string>('');
  const { translations: { globalDict } } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled}>
          <PlusIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{globalDict.addProfile}</DialogTitle>
          <DialogDescription>{globalDict.enterNewProfileName}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            className="w-full"
            type="text"
            placeholder=""
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                {globalDict.cancel}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                disabled={newProfileName.trim().length === 0}
                onClick={() => {
                  if (onSubmit) onSubmit(newProfileName.trim());
                }}
                autoFocus
              >
                {globalDict.create}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

const DeleteProfileDialog: FC<{
  profileName: string | undefined,
  onClose?: () => void,
  onSubmit?: () => void
}> = ({ profileName, onClose, onSubmit }) => {
  const { translations: { globalDict } } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <TrashIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{globalDict.deleteProfile}</DialogTitle>
          <DialogDescription>{globalDict.deleteProfileAreYouSureQ(profileName || 'Default Profile')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                {globalDict.cancel}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                onClick={async () => {
                  if (onSubmit) { onSubmit(); }
                }}
                autoFocus
              >
                {globalDict.delete}
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export const ProfileSetupPage: FC = () => {
  const { profileDB, isLoading, delProfileRecord, addProfileRecord, updateProfileRecord, setActiveProfileId } = useProfile();
  const { translations: { globalDict, profileDict } } = useLanguage();
  const routerLocation = useRouterLocation();
  const isEditMode = ['/radar', '/inbox'].includes(routerLocation.state?.from);

  const profileId = profileDB?.activeProfileId;
  const profileIdList = useMemo(() =>
    profileDB ? Object.keys(profileDB.profileRecords).filter(id => !!profileDB.profileRecords[id].profileName) : [],
    [profileDB]
  );
  const profileInfo = profileDB?.profileRecords[profileDB?.activeProfileId];
  const { location, setLocation } = useLocation();


  const handleProfileChange = useCallback((field: keyof SelfProfileRecord, value: string | undefined) => {
    if (profileInfo) {
      let record = { ...profileInfo };
      if (field === 'hosting' && value === 'hostOnly') {
        record = {
          ...profileInfo,
          [field]: value || '',
          travelDistance: 'none'
        };
      } else {
        record = {
          ...profileInfo,
          [field]: value || ''
        };
      }
      updateProfileRecord(record, false);
    }
  }, [profileInfo, updateProfileRecord]);


  const handleProfileValidation = () => {
    console.log('handleProfileValidation', profileInfo);
    if (profileInfo) {
      try {
        updateProfileRecord(profileInfo, true);
      } catch (error) {
        return false;
      }
    }
    return true;
  };


  const handleActiveProfileChange = useCallback((value: ProfileId) => {
    setActiveProfileId(value);
  }, [setActiveProfileId]);

  const handleDeleteProfile = useCallback(async () => {
    if (profileInfo) {
      await delProfileRecord(profileInfo);
    }
  }, [profileInfo, delProfileRecord]);


  const handleCreateProfile = useCallback(async (newProfileName: string) => {
    if (profileInfo) {
      await addProfileRecord({...profileInfo, profileName: newProfileName});
    }
  }, [profileInfo, addProfileRecord]);


  const handleUpdateLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const offset = getRandomOffset(location?.randomizationRadius || 0);

          const newLocation: Location = {
            ...location,
            mode: 'automatic',
            latitude: latitude + offset.lat,
            longitude: longitude + offset.lng,
            address: undefined
          };

          setLocation(newLocation);
          resolve();
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
    });
  }, [location, setLocation]);


  const profileOptions = useMemo(() =>
    profileIdList.reduce((obj, id) => {
      obj[id] = profileDB?.profileRecords[id]?.profileName || id;
      return obj;
    }, {} as Record<string, string>),
    [profileIdList, profileDB]
  );

  return (isLoading) ? (
    <Page back={true}>
      <Content>
        <div className="flex items-center justify-center h-full">
          <div>{globalDict.loading}</div>
        </div>
      </Content>
    </Page>
  ) : (
    <Page back={true}>
      <Content className="text-sm">
        <ContentFeed>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <div className="flex items-end">
                <div className="grow">
                  <ProfileSelect
                    disabled={isEditMode}
                    className="font-bold"
                    selectCfg={{
                      label: isEditMode ? globalDict.myProfile : globalDict.selectProfile,
                      options: profileOptions
                    }}
                    enableClearOption={false}
                    value={profileId}
                    onValueChange={(value) => handleActiveProfileChange(value)}
                  />
                </div>
                {!isEditMode && (<>
                  <div>
                    <CreateProfileDialog
                      onSubmit={handleCreateProfile}
                      disabled={!profileDB?.freeProfileIds.length}
                    />
                  </div>
                  <div>
                    <DeleteProfileDialog
                      profileName={profileInfo?.profileName}
                      onSubmit={handleDeleteProfile}
                    />
                  </div>
                </>)}
              </div>
            </div>

            <div className="col-span-2">
              <span className="ps-1">{profileDict.nickName.label}</span>
              <div className="flex items-end gap-2">
                <div className="grow">
                  <Input
                    type="text"
                    className="text-sm"
                    placeholder={profileDict.nickName.label}
                    value={profileInfo?.nickName || ''}
                    onChange={(e) => handleProfileChange('nickName', e.target.value)}
                  />
                </div>
                {isEditMode && (<div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(_event) => {
                      const icon = document.getElementById('location-fixed-icon');
                      if (icon) icon.classList.add('animate-spin');
                      handleUpdateLocation().finally(() => {
                        if (icon) icon.classList.remove('animate-spin');
                      });
                    }}
                  >
                    <LocateFixedIcon id="location-fixed-icon" className="w-4 h-4" />
                    {globalDict.updateLocation}
                  </Button>
                </div>)}
              </div>
            </div>

            <div className="col-span-2 px-10 py-5">
              <ProfileAlbumCarousel onAlbumEdit={handleProfileValidation} />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.age}
                value={profileInfo?.age}
                onValueChange={(value) => handleProfileChange('age', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.sexualPosition}
                value={profileInfo?.sexualPosition}
                onValueChange={(value) => handleProfileChange('sexualPosition', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.hosting}
                value={profileInfo?.hosting}
                onValueChange={(value) => handleProfileChange('hosting', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.travelDistance}
                disabled={(profileInfo?.hosting !== 'travelOnly') && (profileInfo?.hosting !== 'hostAndTravel')}
                value={profileInfo?.travelDistance}
                onValueChange={(value) => handleProfileChange('travelDistance', value)}
              />
            </div>

            <div className="col-span-2">
              <span className="ps-1">{profileDict.aboutMe.label}</span>
              <TextEditor
                className="text-sm"
                placeholder={profileDict.aboutMe.label}
                value={profileInfo?.aboutMe || ''}
                onChange={(value) => handleProfileChange('aboutMe', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.bodyType}
                value={profileInfo?.bodyType}
                onValueChange={(value) => handleProfileChange('bodyType', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.healthPractices}
                value={profileInfo?.healthPractices}
                onValueChange={(value) => handleProfileChange('healthPractices', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.eggplantSize}
                value={profileInfo?.eggplantSize}
                onValueChange={(value) => handleProfileChange('eggplantSize', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.peachShape}
                value={profileInfo?.peachShape}
                onValueChange={(value) => handleProfileChange('peachShape', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.hivStatus}
                value={profileInfo?.hivStatus}
                onValueChange={(value) => handleProfileChange('hivStatus', value)}
              />
            </div>

            <div>
              <ProfileSelect
                selectCfg={profileDict.preventionPractices}
                value={profileInfo?.preventionPractices}
                onValueChange={(value) => handleProfileChange('preventionPractices', value)}
              />
            </div>
          </div>
        </ContentFeed>
        <ProfileNavigationBar onValidate={handleProfileValidation}/>
      </Content>
    </Page>
  );
}
