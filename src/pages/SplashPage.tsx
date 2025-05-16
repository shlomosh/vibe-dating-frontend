import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/Link/Link';

import logoImage from '@/assets/logo.png';
import { splashText } from '@/locale/en-US';

export const SplashPage: FC = () => {    
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('demo-index');
    }

    return (
        <Page className="min-h-screen" back={false}>
            <div className="w-full h-screen bg-background">
                <div className="relative w-full h-full">
                    {/* Background image with overlay */}
                    <div className="absolute inset-0 bg-cover bg-center bg-[url(@/assets/pexels-koolshooters-6621600.jpg)]">
                        <div className="h-full w-full [background:linear-gradient(180deg,rgba(0,0,0,0.67)_0%,rgba(0,0,0,0.65)_100%)]" />
                    </div>                    
                    {/* Content container - flex column to position items at bottom */}
                    <Content>
                        <div className="flex flex-col items-center justify-center gap-4 p-[min(1.5em,5%)] w-full">
                            {/* Logo */}
                            <img className="w-60 h-auto mb-6 object-cover" alt="COCHI" src={logoImage} />
                            {/* Terms text */}
                            <p className="text-sm text-muted-foreground text-center">
                                <Link to="/read-terms-conditions">{splashText.readTermsAndConditions}</Link>
                            </p>
                            {/* Login button */}
                            <Button
                                className="bg-primary text-white hover:bg-primary/80"
                                onClick={handleLoginClick}
                            >
                                {splashText.acceptTermsAndLogin}
                            </Button>
                        </div>
                    </Content>
                </div>
            </div>
        </Page>
    );
}