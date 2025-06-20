import { useMemo, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { routes } from '@/navigation/routes.tsx';

import { retrieveLaunchParams, useSignal, isMiniAppDark, expandViewport, requestFullscreen } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/contexts/ThemeToggle"
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProfileProvider } from '@/contexts/ProfileContext';

export function App() {
    const tgLaunchParams = useMemo(() => retrieveLaunchParams(), []);
    const tgIsDark = useSignal(isMiniAppDark);
    const tgFullscreenRequested = useRef(false);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                expandViewport();
                if (!tgFullscreenRequested.current) {
                    tgFullscreenRequested.current = true;
                    await requestFullscreen();
                }
            } catch (error) {
                console.warn('Failed to initialize app:', error);
            }
        };

        initializeApp();
    }, []);

    return (
        <AppRoot
            appearance={tgIsDark ? 'dark' : 'light'}
            platform={['macos', 'ios'].includes(tgLaunchParams.tgWebAppPlatform) ? 'ios' : 'base'}
        >
            <ThemeProvider defaultTheme={tgIsDark ? 'dark' : 'light'} storageKey="tw-theme">
                <LanguageProvider>
                    <ProfileProvider>
                        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <Routes>
                                {routes.map((route) => <Route key={route.path} {...route} />)}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                            <div className="absolute top-[18px] left-1/2 -translate-x-1/2">
                                <ThemeToggle />
                            </div>
                        </HashRouter>
                    </ProfileProvider>
                </LanguageProvider>
            </ThemeProvider>
        </AppRoot>
    );
}
