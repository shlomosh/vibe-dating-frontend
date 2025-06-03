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
            <Content>
                <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] w-full h-full">
                    <div className="border-2 col-span-1 border-red-200">
                        <div className="text-[1.2em] font-bold text-primary text-center">
                            {termsAndConditionsPage.titleText}
                        </div>
                    </div>
                    <div className="border-2 col-span-1 border-red-200 overflow-y-auto">
                        <ScrollArea>
                            <Card className="bg-transparent border-none shadow-none px-[1em] py-[1em]">
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
                        </ScrollArea>
                    </div>
                    <div className="border-2 col-span-1 border-red-200">
                        <div className="flex flex-col min-h-[3em] text-center justify-center">
                            <div>
                                <Button
                                    className="bg-primary text-white hover:bg-primary/80 min-w-[15em] mt-auto mx-auto"
                                    onClick={handleAcceptClick}
                                >
                                    {termsAndConditionsPage.acceptButton}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        </Page>
    );
};
