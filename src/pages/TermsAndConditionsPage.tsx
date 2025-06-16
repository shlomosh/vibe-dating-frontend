import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentFeed } from '@/components/ContentFeed';
import { ContentNavigation } from '@/components/ContentNavigation';
import { CheckIcon } from 'lucide-react';

export const TermsAndConditionsPage: FC = () => {
    const navigate = useNavigate();
    const { translations: { globalDict, termsAndConditionsDict } } = useLanguage();

    const handleAcceptClick = () => {
        navigate('/');
    }

    const navigationItems = [
        {
            icon: CheckIcon,
            label: globalDict.accept,
            onClick: handleAcceptClick
        }
    ];

    return (
        <Page back={true}>
            <Content>
                <ContentFeed>
                    <div className="text-xl font-bold text-center py-6">{globalDict.termsAndConditions}</div>
                    <div className="text-md text-justify">
                        {termsAndConditionsDict.sectionsText.map((section, index) => (
                            <div key={index} className="py-3">
                                <h2 className="font-bold">
                                    {section.title}
                                </h2>
                                <p className="text-[0.8em] py-1">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </ContentFeed>
                <ContentNavigation items={navigationItems} />
            </Content>
        </Page>
    );
};
