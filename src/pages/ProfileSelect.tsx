import type { FC } from 'react';
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

import { profilePage } from '@/locale/en-US';

import { Navigation, EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


const ProfileSelect: FC<{ selectCfg: { label: string, options: any }, className?: string, disabled?: boolean }> = ({ selectCfg, className = "", disabled = false }) => {
    return (
        <div className={className}>
            <Select disabled={disabled}>
                <SelectTrigger className="w-full">
                    <SelectValue className="text-sm" placeholder={selectCfg.label} />
                </SelectTrigger>
                <SelectContent className="text-sm">
                    <SelectGroup>
                        <SelectLabel>{selectCfg.label}</SelectLabel>
                        <SelectItem key={'--'} value={'--'}>--</SelectItem>
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
        <div className="w-[180px] h-[180px]">
            <Swiper
                effect={'cards'}
                navigation={true}
                grabCursor={true}
                modules={[Navigation, EffectCards]}
                className="w-full h-full"
            >
                {images.map((item, index) => (
                    <SwiperSlide key={index} className="flex rounded-[15%] items-center justify-center">
                        <div className="flex items-center justify-center text-[22px] font-bold text-white w-full h-full">
                            <img 
                                src={item} 
                                alt={`Profile avatar ${index + 1}`} 
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
    return (
        <Page back={true}>
            <Content className="justify-start">
                <div className="grid grid-cols-6 gap-2 w-full mt-5">
                    <div className="col-span-6 flex justify-center mb-5">
                        <UserAvatarCarousel />
                    </div>
                    <Input className="col-span-6 text-sm" type="text" placeholder={profilePage.nickName.label}/>
                    <Textarea className="col-span-6 text-sm" placeholder={profilePage.aboutMe.label} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.age} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.position} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.body} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.equipment} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.healthPractices} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.hivStatus} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.hosting} />
                    <ProfileSelect className="col-span-3" selectCfg={profilePage.travelDistance} disabled={true}/>
                    {/* <ProfileSelect className="col-span-2" selectCfg={profilePage.meetingTime} />
                    <ProfileSelect className="col-span-2" selectCfg={profilePage.chatStatus} /> */}
                </div>
            </Content>
        </Page>
    );
}
