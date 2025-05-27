import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/Link/Link';

import peachImage from '@/assets/peach.png';
import { splashText } from '@/locale/en-US';

const styles = `
@keyframes rotateV {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-90deg);
  }
}

.rotate-v {
  animation: rotateV 0.5s ease-out 1.0s forwards;
}
`;

export const SplashPage: FC = () => {    
    const navigate = useNavigate();

    const handleNextClick = () => {
        navigate('profile-select'); // demo-index
    }

    return (
        <Page back={false}>
            <style>{styles}</style>
            <div className="h-full relative">
                {/*
                <div className="absolute inset-0 bg-cover bg-center bg-[url(@/assets/login-bg-17.jpg)]">
                    <div className="h-full [background:linear-gradient(180deg,rgba(0,0,0,0.67)_0%,rgba(0,0,0,0.65)_100%)]" />
                </div>
                */}
                <Content>           
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center">
                            <span className="text-[4em] hover:text-primary rotate-v">V</span>
                            <span className="text-[4em] hover:text-primary">I</span>
                            <span className="text-[4em] hover:text-primary">B</span>
                            <span className="text-[4em] hover:text-primary">E</span>
                            <img src={peachImage} alt="Peach" className="w-[6em] h-[6em] -mt-3" />
                        </div>
                        <div className="text-[1.2em] pb-[3em] text-primary">find what makes you vibe, anytime.</div>
                        <p className="text-sm text-muted-foreground text-center pb-[2em]">
                            <Link to="/read-terms-conditions">{splashText.readTermsAndConditions}</Link>
                        </p>
                        <Button
                            className="bg-primary text-white hover:bg-primary/80 min-w-[15em] mt-auto mx-auto mb-4"
                            onClick={handleNextClick}
                        >
                            {splashText.acceptTermsAndLogin}
                        </Button>
                    </div>
                </Content>
            </div>
        </Page>
    );
}