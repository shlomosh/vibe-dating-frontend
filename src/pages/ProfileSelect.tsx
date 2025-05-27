import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
  
import { profilePage } from '@/locale/en-US';
import { ProfileId, ProfileRecord, ProfileDB, defaultProfile } from '@/types/profile';

import { Navigation, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { generateRandomProfileName } from '@/utils/generator';

import { PlusIcon, TrashIcon, MinusIcon } from 'lucide-react';
import { initData as tgInitData } from '@telegram-apps/sdk-react';
import { CloudStorage as profileStorage } from '@/utils/cloud-storage';


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
        <div className="w-full aspect-[160/240] rounded-[5%] overflow-hidden">
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
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const tgUser = tgInitData.user();

    const [profileId, setProfileId] = useState<string | undefined>('Anonymous');
    const [profileIdList, setProfileIdList] = useState<Array<string>>(['Anonymous']);
    const [profileRecord, setProfileRecord] = useState<ProfileRecord>({
        ... defaultProfile,
        nickName: generateRandomProfileName(tgUser?.id || -1)
    });

    useEffect(() => {
        const loadProfile = async () => {
            const profileDB: ProfileDB | null = await profileStorage.getItem('vibe/settings/profile-db');
            if (profileDB) {
                setProfileRecord(profileDB.db[profileDB.id]);
                setProfileIdList(Object.keys(profileDB.db));
                setProfileId(profileDB.id);
            }
        };

        loadProfile();
    }, []);

    const handleProfileChange = (field: keyof ProfileRecord, value: string) => {
        if (field === 'hosting' && value === 'hostOnly') {
            setProfileRecord((prev) => ({...prev, [field]: value, travelDistance: 'none'}));
        } else {
            setProfileRecord((prev) => ({...prev, [field]: value}));
        }
    };

    const handleActiveProfileChange = (value: ProfileId) => {
        setProfileId(value);
    };

    const handleContinueClick = () => {
        navigate('demo-index');
    }

    return (
        <Page back={true}>
            <Content>
                <div className="grid grid-cols-6 gap-2 mb-4">
                    <div className="col-span-6 mb-5 flex items-end">
                        <span className="w-full">
                            <ProfileSelect 
                                className="font-bold"
                                selectCfg={{
                                    label: 'Active Profile',
                                    options: profileIdList.reduce((obj, id) => ({ ...obj, [id]: id }), {})
                                }}
                                enableClearOption={false}
                                value={profileId}
                                onValueChange={(value) => handleActiveProfileChange(value)}
                            />
                        </span>
                        <span className="mx-1">
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
                    <div className="col-span-3 flex flex-col gap-2">
                        <div className="flex flex-col">
                            <span className="text-sm text-foreground/40 px-1">{profilePage.nickName.label}</span>
                            <Input 
                                className="text-sm"
                                type="text" 
                                placeholder={profilePage.nickName.label}
                                value={profileRecord?.nickName}
                                onChange={(e) => handleProfileChange('nickName', e.target.value)}
                            />
                        </div>
                        <ProfileSelect 
                            selectCfg={profilePage.age}
                            value={profileRecord?.age}
                            onValueChange={(value) => handleProfileChange('age', value)}
                        />
                        <ProfileSelect 
                            selectCfg={profilePage.position}
                            value={profileRecord?.position}
                            onValueChange={(value) => handleProfileChange('position', value)}
                        />
                        <ProfileSelect 
                            selectCfg={profilePage.hosting}
                            value={profileRecord?.hosting}
                            onValueChange={(value) => handleProfileChange('hosting', value)}
                        />
                        <ProfileSelect 
                            selectCfg={profilePage.travelDistance}
                            disabled={(profileRecord?.hosting !== 'travelOnly') && (profileRecord?.hosting !== 'hostAndTravel')}
                            value={profileRecord?.travelDistance}
                            onValueChange={(value) => handleProfileChange('travelDistance', value)}
                        />
                    </div>
                    <div className="col-span-3">
                        <span className="text-sm text-foreground/40 px-1">Album:</span>
                        <UserAvatarCarousel />
                    </div>
                    <Collapsible className="col-span-6" open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleTrigger className="my-2">
                            <div className="flex items-center gap-2">
                                {isOpen ? (<>
                                    <MinusIcon className="w-4 h-4" />
                                    <span className="text-sm">Extra profile settings...</span>
                                </>) : (<>
                                    <PlusIcon className="w-4 h-4" />
                                    <span className="text-sm">Extra profile settings...</span>
                                </>)}
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="grid grid-cols-2 gap-2">
                            <div className="col-span-2">
                                <span className="text-sm text-foreground/40 px-1">{profilePage.aboutMe.label}</span>
                                <Textarea 
                                    className="text-sm" 
                                    placeholder={profilePage.aboutMe.label}
                                    value={profileRecord?.aboutMe}
                                    onChange={(e) => handleProfileChange('aboutMe', e.target.value)}
                                />
                            </div>
                            <ProfileSelect 
                                selectCfg={profilePage.body}
                                value={profileRecord?.body}
                                onValueChange={(value) => handleProfileChange('body', value)}
                            />
                            <ProfileSelect 
                                selectCfg={profilePage.equipment}
                                value={profileRecord?.equipment}
                                onValueChange={(value) => handleProfileChange('equipment', value)}
                            />
                            <ProfileSelect 
                                selectCfg={profilePage.healthPractices}
                                value={profileRecord?.healthPractices}
                                onValueChange={(value) => handleProfileChange('healthPractices', value)}
                            />
                            <ProfileSelect 
                                selectCfg={profilePage.hivStatus}
                                value={profileRecord?.hivStatus}
                                onValueChange={(value) => handleProfileChange('hivStatus', value)}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                </div>
                <Button
                    className="bg-primary text-white hover:bg-primary/80 min-w-[15em] mt-auto mx-auto mb-4"
                    onClick={handleContinueClick}
                >
                    {"Next >"}
                </Button>
            </Content>
        </Page>
    );
}
