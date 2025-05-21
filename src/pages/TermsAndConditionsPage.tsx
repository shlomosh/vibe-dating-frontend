import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { termsAndConditionsPage } from '@/locale/en-US';

export const TermsAndConditionsPage: FC = () => {
    const navigate = useNavigate();

    const handleAcceptClick = () => {
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
                    {/* Content container */}
                    <Content>
                        <div className="text-center">
                            <div className="text-[1.2em] font-bold text-primary">{termsAndConditionsPage.titleText}</div>
                        </div>
                        <ScrollArea className="h-[calc(100%-3rem)] p-[0.4em]">
                            <Card className="bg-transparent border-none shadow-none p-[0.8em]">
                                <CardContent className="p-0">
                                    {termsAndConditionsPage.sectionsText.map((section, index) => (
                                    <div key={index} className="mb-6">
                                        <h2 className="text-[1.0em] font-bold mb-2">
                                            {section.title}
                                        </h2>
                                        <p className="text-[0.8em] text-justify">
                                            {section.content}
                                        </p>
                                    </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <div className="text-center mb-8">
                            <Button
                                className="bg-primary text-white hover:bg-primary/80 w-[min(30%,12em)]"
                                onClick={handleAcceptClick}
                            >
                                {termsAndConditionsPage.acceptButton}
                            </Button>
                            </div>
                        </ScrollArea>
                    </Content>
                </div>
            </div>
        </Page>
    );
};
