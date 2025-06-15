import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content, ContentHeader } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from '@/contexts/LanguageContext';

export const TermsAndConditionsPage: FC = () => {
    const navigate = useNavigate();
    const { translations: { globalDict, termsAndConditionsDict }, direction } = useLanguage();

    const handleAcceptClick = () => {
        navigate('/');
    }

    return (
        <Page back={true}>
            <Content>
                <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] w-full h-full">
                    <div className="col-span-1">
                        <ContentHeader text={globalDict.termsAndConditions} />
                    </div>
                    <div className="col-span-1 overflow-y-auto">
                        <ScrollArea dir={direction}>
                            <Card className="bg-transparent border-none shadow-none px-[1em] py-[1em]">
                                <CardContent className="p-0">
                                    {termsAndConditionsDict.sectionsText.map((section, index) => (
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
                    <div className="col-span-1">
                        <div className="flex flex-col min-h-[3em] text-center justify-center">
                            <div>
                                <Button
                                    className="bg-primary text-white hover:bg-primary/80 min-w-[15em] mt-auto mx-auto"
                                    onClick={handleAcceptClick}
                                >
                                    {globalDict.accept}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        </Page>
    );
};
