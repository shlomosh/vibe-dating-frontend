import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

import { termsAndConditionsText } from '@/locale/en-US';

export const TermsAndConditionsPage: FC = () => {
    const navigate = useNavigate();

    const handleCloseClick = () => {
        navigate('/');
    }

    return (
        <Page back={true}>
            <div className="w-full h-screen bg-white overflow-hidden">
                <div className="relative w-full h-full">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0">
                        <div className="relative w-full h-full bg-[url(assets/login-bg-17.jpg)] bg-cover bg-center">
                            <div className="h-full w-full [background:linear-gradient(180deg,rgba(0,0,0,0.67)_0%,rgba(0,0,0,0.65)_100%)]" />
                        </div>
                    </div>
                    {/* Content container - flex column to position items at bottom */}
                    <Content className="" itemsAlign="left">
                        <div className="flex justify-between items-start mb-4 pl-6 pr-6 pt-12">
                            <h1 className="text-xl font-bold text-white">{termsAndConditionsText.title}</h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white hover:bg-white/10 border border-white"
                                onClick={handleCloseClick}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <ScrollArea className="h-[calc(100%-3rem)] pl-6 pr-6 pb-12">
                            <Card className="bg-transparent border-none shadow-none font-['Questrial-Regular',Helvetica] text-base">
                                <CardContent className="p-0 text-white">
                                    {termsAndConditionsText.sections.map((section, index) => (
                                    <div key={index} className="mb-4">
                                        <h2 className="text-[11px] font-bold mb-2">
                                            {section.title}
                                        </h2>
                                        <p className="text-[11px] whitespace-pre-line ml-2">
                                            {section.content}
                                        </p>
                                    </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </ScrollArea>
                    </Content>
                </div>
            </div>
        </Page>
    );
};
