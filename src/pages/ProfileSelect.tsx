import type { FC } from 'react';
import { useState, useEffect } from 'react';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

import { profilePage } from '@/locale/en-US';
import { ProfileState, defaultProfileState } from '@/types/profile';

import { Navigation, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { generateRandomProfileName } from '@/utils/generator';
import { initData as tgInitData, cloudStorage as tgCloudStorage } from '@telegram-apps/sdk-react';
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';

const ProfileSelect: FC<{ selectCfg: { label: string, options: any }, className?: string, enableClearOption?: boolean, disabled?: boolean, value?: string, onValueChange?: (value: string) => void }> = ({ selectCfg, className = "", enableClearOption = true, disabled = false, value, onValueChange }) => {
    return (
        <div className={className}>
            <Select disabled={disabled} value={value} onValueChange={onValueChange}>
                <span className="text-sm text-foreground/40 px-1">{selectCfg.label}</span>
                <SelectTrigger className="w-full">
                    <SelectValue className="text-sm" placeholder="--" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectGroup>
                        <SelectLabel>{selectCfg.label}</SelectLabel>
                        {enableClearOption ? (<SelectItem className="text-xs italic" key={'--'} value={'--'}>--</SelectItem>) : null}
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
}

const UserAvatarCarousel = () => {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const loadImages = async () => {
            const imageModules = await Promise.all([
                import('@/assets/sample/00.jpg'),
                import('@/assets/sample/01.jpg'),
                import('@/assets/sample/02.jpg'),
                import('@/assets/sample/03.jpg'),
                import('@/assets/sample/04.jpg'),
                import('@/assets/sample/05.jpg'),
                import('@/assets/sample/06.jpg'),
                import('@/assets/sample/07.jpg'),
                import('@/assets/sample/08.jpg'),
                import('@/assets/sample/09.jpg'),
            ]);
            
            setImages(imageModules.map(module => module.default));
        };

        loadImages();
    }, []);

    return (
        <div className="w-[160px] h-[240px] rounded-[5%] overflow-hidden">
            <Swiper
                effect={'fade'}
                navigation={true}
                grabCursor={true}
                modules={[Navigation, EffectFade]}
                className="w-full h-full"
            >
                {images.map((item, index) => (
                    <SwiperSlide key={index} className="flex items-center justify-center">
                        <div className="flex w-full h-full">
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
                                    transform: "scale(1.5)"
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export const ProfileSelectPage: FC = () => {
    const [activeProfile, setActiveProfile] = useState<string>('default');
    const [profile, setProfile] = useState<ProfileState>(defaultProfileState);
    const tgUser = tgInitData.user();

    const loadStoredProfile = async () => {
        const storedProfileJson = await tgCloudStorage.getItem('profile/default');
        return storedProfileJson ? JSON.parse(storedProfileJson) : undefined;
    };

    const getNickName = (nickName: string) => (
        (nickName === '') ? generateRandomProfileName(tgUser?.id || -1) : nickName
    );

    useEffect(() => {
        const loadProfile = async () => {
            const storedProfile = await loadStoredProfile();
            setProfile((profile) => ({
                ...(storedProfile || profile),
                nickName: getNickName((storedProfile || profile).nickName)
            }));
        };

        loadProfile();
    }, []);

    const handleProfileChange = (field: keyof ProfileState, value: string) => {
        setProfile(prev => ({
            ...prev,
            [field]: value === '--' ? '' : value
        }));
    };

    const handleActiveProfileChange = (value: string) => {
        setActiveProfile(value);
    };

    return (
        <Page back={true}>
            <Content className="justify-start">           
                <div className="grid grid-cols-6 gap-2 w-full mt-5">
                    <div className="col-span-6 mb-5 flex items-end">
                        <span className="w-full">
                            <ProfileSelect 
                                className="font-bold"
                                selectCfg={{
                                    label: 'Active Profile',
                                    options: {
                                        1: 'Default',
                                    }
                                }}
                                enableClearOption={false}
                                value={activeProfile}
                                onValueChange={(value) => handleActiveProfileChange(value)}
                            />
                        </span>
                        <span className="mr-1 ml-1">
                            <Button variant="outline" size="icon">
                                <PlusIcon className="w-4 h-4" />
                            </Button>
                        </span>
                        <span>
                            <Button variant="outline" size="icon">
                                <TrashIcon className="w-4 h-4" />
                            </Button>
                        </span>
                    </div>     
                    <div className="col-span-6 flex justify-center mb-0">
                        <UserAvatarCarousel />
                    </div>
                    <div className="col-span-6 text-sm">
                        <span className="text-foreground/40 px-1">{profilePage.nickName.label}</span>
                        <Input 
                            className="col-span-6 text-sm"
                            type="text" 
                            placeholder={profilePage.nickName.label}
                            value={profile.nickName}
                            onChange={(e) => handleProfileChange('nickName', e.target.value)}
                        />
                    </div>
                    <div className="col-span-6 text-sm">
                        <span className="text-sm text-foreground/40 px-1">{profilePage.aboutMe.label}</span>
                        <Textarea 
                            className="col-span-6 text-sm" 
                            placeholder={profilePage.aboutMe.label}
                            value={profile.aboutMe}
                            onChange={(e) => handleProfileChange('aboutMe', e.target.value)}
                        />
                    </div>
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.age}
                        value={profile.age}
                        onValueChange={(value) => handleProfileChange('age', value)}
                    />
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.position}
                        value={profile.position}
                        onValueChange={(value) => handleProfileChange('position', value)}
                    />
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.body}
                        value={profile.body}
                        onValueChange={(value) => handleProfileChange('body', value)}
                    />
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.equipment}
                        value={profile.equipment}
                        onValueChange={(value) => handleProfileChange('equipment', value)}
                    />
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.healthPractices}
                        value={profile.healthPractices}
                        onValueChange={(value) => handleProfileChange('healthPractices', value)}
                    />
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.hivStatus}
                        value={profile.hivStatus}
                        onValueChange={(value) => handleProfileChange('hivStatus', value)}
                    />
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.hosting}
                        value={profile.hosting}
                        onValueChange={(value) => handleProfileChange('hosting', value)}
                    />
                    <ProfileSelect 
                        className="col-span-3" 
                        selectCfg={profilePage.travelDistance}
                        disabled={(profile.hosting === 'travelOnly') || (profile.hosting === 'hostAndTravel')}
                        value={profile.travelDistance}
                        onValueChange={(value) => handleProfileChange('travelDistance', value)}
                    />
                </div>
            </Content>
        </Page>
    );
}
