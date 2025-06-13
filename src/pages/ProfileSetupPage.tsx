import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import { Page } from '@/components/Page.tsx';
import { Content, ContentHeader } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { TextEditor } from '@/components/TextEditor';
import { ImageEditor } from '@/components/ImageEditor';

import { profileDict, globalDict } from '@/locale/en-US';
import { ProfileId, ProfileRecord, defaultProfile } from '@/types/profile';

import { Navigation, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { useProfile } from '@/contexts/profile-context';


const ProfileSelect: FC<{ selectCfg: { label?: string, options: any }, className?: string, enableClearOption?: boolean, disabled?: boolean, value?: string, onValueChange?: (value: string) => void }> = ({ selectCfg, className = "", enableClearOption = true, disabled = false, value = '--', onValueChange }) => {
    return (
        <div className={className}>
            <Select disabled={disabled} value={value} onValueChange={onValueChange}>
                {selectCfg.label && <span className="text-sm text-foreground px-1">{selectCfg.label}</span>}
                <SelectTrigger className="w-full text-sm text-foreground">
                    <SelectValue placeholder="--" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{selectCfg.label}</SelectLabel>
                        {enableClearOption ? (<SelectItem className="italic" key={'--'} value={'--'}>--</SelectItem>) : null}
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

const ProfileAlbumCarousel = () => {
    const [images, setImages] = useState<string[]>([]);
    const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
    const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const loadImages = async () => {
            const imageModules = await Promise.all([
                import('@/assets/sample/00.jpg'),
                import('@/assets/sample/01.jpg'),
                import('@/assets/sample/02.jpg'),
                import('@/assets/sample/03.jpg'),
                // import('@/assets/sample/04.jpg'),
                // import('@/assets/sample/05.jpg'),
            ]);
            
            setImages(imageModules.map(module => module.default));
        };

        loadImages();
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const clickPercentage = (clickY / rect.height) * 100;
        
        if (clickPercentage <= 75) {
            setIsAlbumDialogOpen(true);
        }
    };

    const handleDeleteImage = () => {
        if (images.length > 0) {
            const newImages = [...images];
            newImages.splice(currentSlideIndex, 1);
            setImages(newImages);
            // Reset current slide index if we're at the end
            if (currentSlideIndex >= newImages.length) {
                setCurrentSlideIndex(Math.max(0, newImages.length - 1));
            }
        }
    };

    const handleAddImage = (imageUrl: string) => {
        console.log('handleAddImage', imageUrl);
        setImages([...images, imageUrl]);
    };

    const CarouselContent = () => {
        const swiperRef = React.useRef<any>(null);

        return (
            <div className="relative w-full aspect-[160/240] rounded-[2%] overflow-hidden bg-foreground/10">
                <Swiper
                    effect={'fade'}
                    grabCursor={true}
                    modules={[Navigation, EffectFade]}
                    className="w-full h-full"
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                >
                    {images.length > 0 ? images.map((item, index) => (
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
                    )) : (
                        <SwiperSlide className="flex items-center justify-center">
                            <div className="flex w-full h-full items-center justify-center text-foreground">
                                {(isAlbumDialogOpen) ? (<>{globalDict.noImagesOnAlbum}</>) : (<>{globalDict.clickToEditAlbum}</>)}
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
                <div className="absolute w-full top-[100%] pb-16 px-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="flex justify-between">
                        <ChevronLeftIcon 
                            className="w-10 h-10 rounded-[8px] p-1 border-2 bg-black/50 text-white border-white/20 hover:border-white/50"
                            onClick={() => swiperRef.current?.slidePrev()}
                        />
                        <ChevronRightIcon 
                            className="w-10 h-10 rounded-[8px] p-1 border-2 bg-black/50 text-white border-white/20 hover:border-white/50"
                            onClick={() => swiperRef.current?.slideNext()}
                        />
                    </div>
                </div>                
            </div>
        );
    };

    return (
        <>
            <div onClick={handleClick} className="cursor-pointer">
                <CarouselContent />
            </div>
            <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
                <DialogContent className="w-auto h-auto p-0 border-2 border border-primary rounded-[2%]">
                    <div className="w-[85vw] aspect-[160/240]">
                        <CarouselContent />
                        <div className="absolute top-[100%] pb-16 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                                <div className="flex gap-2">
                                    <TrashIcon 
                                        className={
                                            `w-10 h-10 rounded-[8px] p-2 border-2 bg-black/50 ${
                                                images.length == 0 
                                                    ? "text-white/50 border-white/10 cursor-not-allowed"
                                                    : "text-white border-white/20 hover:border-white/50"
                                            }`}
                                        onClick={handleDeleteImage}
                                    />
                                    <PlusIcon 
                                        className={
                                            `w-10 h-10 rounded-[8px] p-2 border-2 bg-black/50 ${
                                            images.length >= 5 
                                                ? "text-white/50 border-white/10 cursor-not-allowed"
                                                : "text-white border-white/20 hover:border-white/50"
                                          }`}
                                        onClick={() => {
                                            if (images.length < 5) {
                                                setIsImageEditorOpen(true);
                                            }
                                        }}
                                    />
                                </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isImageEditorOpen} onOpenChange={setIsImageEditorOpen}>
                <DialogContent className="w-auto h-auto p-0 border-2 border border-primary rounded-[2%]">
                    <div className="w-[85vw] aspect-[160/240]">
                    <ImageEditor 
                        onCancel={() => setIsImageEditorOpen(false)}
                        onImageSave={handleAddImage}
                    />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

const CreateProfileDialog: FC<{
    onClose?: () => void,
    onSubmit?: (newProfileId: string) => void
}> = ({ onClose, onSubmit }) => {
    const [newProfileId, setNewProfileId] = useState<string>('');

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline" size="icon">
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{globalDict.addProfile}</DialogTitle>
                    <DialogDescription>
                        {globalDict.enterNewProfileName}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input 
                        className="w-full"
                        type="text" 
                        placeholder={newProfileId}
                        value={newProfileId}
                        onChange={(e) => setNewProfileId(e.target.value)}
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
                                disabled={newProfileId.trim().length === 0}
                                onClick={() => { 
                                    if (onSubmit) onSubmit(newProfileId.trim()); 
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
    profileId: string | undefined,
    onClose?: () => void,
    onSubmit?: () => void
}> = ({ profileId, onClose, onSubmit }) => {

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline" size="icon">
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{globalDict.deleteProfile}</DialogTitle>
                    <DialogDescription>
                        {globalDict.deleteProfileAreYouSureQ(profileId || 'Anonymous')}
                    </DialogDescription>
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
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { profileDB, setProfileDB, isLoading } = useProfile();

    const [profileId, setProfileId] = useState<string | undefined>();
    const [profileIdList, setProfileIdList] = useState<Array<string>>([]);
    const [profileRecord, setProfileRecord] = useState<ProfileRecord>(defaultProfile);

    useEffect(() => {
        if (profileDB) {
            const activeProfileId = profileDB.id || Object.keys(profileDB.db)[0];
            if (activeProfileId) {
                setProfileId(activeProfileId);
                setProfileIdList(Object.keys(profileDB.db));
                setProfileRecord(profileDB.db[activeProfileId]);
            }
        }
    }, [profileDB]);

    const handleProfileChange = (field: keyof ProfileRecord, value: string | undefined) => {
        if (!profileDB || !profileId) return;

        const newProfileDB = { ...profileDB };
        if (field === 'hosting' && value === 'hostOnly') {
            newProfileDB.db[profileId] = {
                ...profileRecord,
                [field]: value || '',
                travelDistance: 'none'
            };
        } else {
            newProfileDB.db[profileId] = {
                ...profileRecord,
                [field]: value || ''
            };
        }
        setProfileDB(newProfileDB);
        setProfileRecord(newProfileDB.db[profileId]);
    };

    const handleActiveProfileChange = (value: ProfileId) => {
        if (!profileDB) return;
        const newProfileDB = { ...profileDB, id: value };
        setProfileDB(newProfileDB);
        setProfileId(value);
        setProfileRecord(newProfileDB.db[value]);
    };

    const handlePrevPageClick = () => {
        navigate('/');
    }

    const handleNextPageClick = () => {
        navigate('/location-setup');
    }

    const handleDeleteProfile = async () => { 
        if (!profileDB || !profileId) return;
        
        const newProfileDB = { ...profileDB };
        delete newProfileDB.db[profileId];
        newProfileDB.id = Object.keys(newProfileDB.db)[0];
        await setProfileDB(newProfileDB);
    }

    const handleCreateProfile = async (newProfileId: string) => {
        if (!profileDB) return;
        
        const newProfileDB = { ...profileDB };
        newProfileDB.db[newProfileId] = profileRecord;
        newProfileDB.id = newProfileId;
        await setProfileDB(newProfileDB);
    }
    
    if (isLoading) {
        return (
            <Page back={true}>
                <Content>
                    <div className="flex items-center justify-center h-full">
                        <div>{globalDict.loading}</div>
                    </div>
                </Content>
            </Page>
        );
    }
    
    return (
        <Page back={true}>
            <Content className='text-md'>
                <div className="grid grid-cols-2 grid-rows-[auto_auto_auto_1fr_auto] w-full h-full gap-2">
                    <div className="col-span-2">
                        <ContentHeader text={globalDict.yourProfile} />
                    </div>
                    <div className="col-span-2">
                        <div className="flex items-end min-h-fit">
                            <div className="grow">
                                <ProfileSelect 
                                    className="font-bold"
                                    selectCfg={{
                                        options: profileIdList.reduce((obj, id) => ({ ...obj, [id]: id }), {})
                                    }}
                                    enableClearOption={false}
                                    value={profileId}
                                    onValueChange={(value) => handleActiveProfileChange(value)}
                                />
                            </div>
                            <div>
                                <CreateProfileDialog onSubmit={handleCreateProfile} />
                            </div>
                            <div>
                                <DeleteProfileDialog profileId={profileId} onSubmit={handleDeleteProfile} />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <span className="text-sm text-foreground px-1">{profileDict.nickName.label}</span>
                                    <Input 
                                        type="text" 
                                        className="text-sm text-foreground"
                                        placeholder={profileDict.nickName.label}
                                        value={profileRecord?.nickName}
                                        onChange={(e) => handleProfileChange('nickName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.age}
                                        value={profileRecord?.age}
                                        onValueChange={(value) => handleProfileChange('age', value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.position}
                                        value={profileRecord?.position}
                                        onValueChange={(value) => handleProfileChange('position', value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.hosting}
                                        value={profileRecord?.hosting}
                                        onValueChange={(value) => handleProfileChange('hosting', value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.travelDistance}
                                        disabled={(profileRecord?.hosting !== 'travelOnly') && (profileRecord?.hosting !== 'hostAndTravel')}
                                        value={profileRecord?.travelDistance}
                                        onValueChange={(value) => handleProfileChange('travelDistance', value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col justify-end">
                        <ProfileAlbumCarousel />
                    </div>
                    <div className="col-span-2">
                        <Collapsible className="col-span-6 text-muted-foreground" open={isOpen} onOpenChange={setIsOpen}>
                            <CollapsibleTrigger className="my-2 w-full">
                                <div className="text-sm flex items-center justify-center gap-2 cursor-pointer">
                                    {isOpen ? (<>
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </>) : (<>
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </>)}
                                    <span>{globalDict.extraProfileSettings}</span>
                                    {isOpen ? (<>
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </>) : (<>
                                        <ChevronLeftIcon className="w-4 h-4" />
                                    </>)}
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <TextEditor
                                        className="text-sm text-foreground"
                                        placeholder={profileDict.aboutMe.label}
                                        value={profileRecord?.aboutMe}
                                        onChange={(value) => handleProfileChange('aboutMe', value)}
                                    />
                                </div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.body}
                                        value={profileRecord?.body}
                                        onValueChange={(value) => handleProfileChange('body', value)}
                                    />
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.healthPractices}
                                        value={profileRecord?.healthPractices}
                                        onValueChange={(value) => handleProfileChange('healthPractices', value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.equipmentSize}
                                        value={profileRecord?.equipmentSize}
                                        onValueChange={(value) => handleProfileChange('equipmentSize', value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.buttShape}
                                        value={profileRecord?.buttShape}
                                        onValueChange={(value) => handleProfileChange('buttShape', value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.hivStatus}
                                        value={profileRecord?.hivStatus}
                                        onValueChange={(value) => handleProfileChange('hivStatus', value)}
                                    />
                                </div>
                                <div>
                                    <ProfileSelect 
                                        selectCfg={profileDict.preventionPractices}
                                        value={profileRecord?.preventionPractices}
                                        onValueChange={(value) => handleProfileChange('preventionPractices', value)}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                    <div className="col-span-2 flex flex-row justify-between">
                        <div className="flex-1 flex justify-center items-center">
                            <Button
                                className="min-w-[10em]"
                                onClick={handlePrevPageClick}
                            >
                                ❮ {globalDict.back}
                            </Button>
                        </div>
                        <div className="flex-1 flex justify-center items-center">
                            <Button
                                className="min-w-[10em]"
                                onClick={handleNextPageClick}
                            >
                                {globalDict.next} ❯
                            </Button>
                        </div>
                    </div>
                </div>
            </Content>
        </Page>
    );
}
