import React, { createContext, useContext, useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';

import { initData as tgInitData } from '@telegram-apps/sdk-react';

import * as enUS from '../locale/en-US';
import * as heIL from '../locale/he-IL';

type Language = 'en-US' | 'he-IL';
type Direction = 'ltr' | 'rtl';

type TranslationType = {
    globalDict: typeof enUS.globalDict;
    nameGenerator: {
        animals: readonly string[];
        adjectives: readonly string[];
    };
    termsAndConditionsDict: typeof enUS.termsAndConditionsDict;
    profileDict: typeof enUS.profileDict;
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    translations: TranslationType;
    direction: Direction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languageConfig: Record<Language, { translations: TranslationType; direction: Direction }> = {
    'en-US': {
        translations: {
            globalDict: enUS.globalDict,
            nameGenerator: enUS.nameGenerator,
            termsAndConditionsDict: enUS.termsAndConditionsDict,
            profileDict: enUS.profileDict,
        },
        direction: 'ltr',
    },
    'he-IL': {
        translations: {
            globalDict: heIL.globalDict,
            nameGenerator: heIL.nameGenerator,
            termsAndConditionsDict: heIL.termsAndConditionsDict,
            profileDict: heIL.profileDict,
        },
        direction: 'rtl',
    },
};

const defaultLanguage: Language = 'en-US';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    useEffect(() => {
        const userLang = tgInitData.user()?.language_code || 'en';
        setLanguage(userLang.startsWith('he') ? 'he-IL' : 'en-US');
    }, []);

    const value = {
        language,
        setLanguage,
        translations: languageConfig[language].translations,
        direction: languageConfig[language].direction,
        toString: (element: any) => {
            return ReactDOMServer.renderToStaticMarkup(element);
        }
    };

    return (
        <LanguageContext.Provider value={value}>
            <div dir={value.direction} className={`${value.direction}`}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
