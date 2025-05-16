import { useMemo } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { retrieveLaunchParams, useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Button } from "@/components/ui/button"
import { routes } from '@/navigation/routes.tsx';

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle"

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <ThemeProvider defaultTheme={isDark ? 'dark' : 'light'} storageKey="tw-theme">
        <HashRouter>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
          <div className="flex flex-col items-center justify-center min-h-svh">
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
            <Button className="bg-primary text-white hover:bg-primary/80">Click me</Button>
            <Button className="bg-secondary text-white hover:bg-secondary/80 mt-4">Or me</Button>
            <Button className="bg-accent text-white hover:bg-accent/80 mt-4">Or me</Button>
            <Button className="bg-destructive text-white hover:bg-destructive/80 mt-4">Or me</Button>
          </div>        
        </HashRouter>
      </ThemeProvider>
    </AppRoot>
  );
}
