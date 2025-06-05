import { useMemo } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { retrieveLaunchParams, useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { routes } from '@/navigation/routes.tsx';

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileProvider } from '@/contexts/profile-context';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <ThemeProvider defaultTheme={isDark ? 'dark' : 'light'} storageKey="tw-theme">
        <ProfileProvider>
          <HashRouter>
            <Routes>
              {routes.map((route) => <Route key={route.path} {...route} />)}
              <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
            <div className="absolute top-[30px] left-1/2 -translate-x-1/2">
              <ThemeToggle />
            </div>
          </HashRouter>
        </ProfileProvider>
      </ThemeProvider>
    </AppRoot>
  );
}
