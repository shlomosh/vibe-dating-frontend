import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/Link/Link';

import peachImage from '@/assets/peach.png';
import { globalDict } from '@/locale/en-US';
// import { Background } from '@/components/Background';

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
        navigate('/profile-setup');
    }

    return (
        <Page back={false}>
            <style>{styles}</style>
            {/* <Background imageUrl="@/assets/login-bg-17.jpg" /> */}
            <Content>
                <div className="grid grid-cols-1 grid-rows-[1fr_auto_auto] w-full h-full">
                    <div className="col-span-1">
                    </div>
                    <div className="col-span-1">
                        <div className="flex w-full justify-center text-gray-900 dark:text-white">
                            <span className="text-[4em] hover:text-primary rotate-v">V</span>
                            <span className="text-[4em] hover:text-primary">I</span>
                            <span className="text-[4em] hover:text-primary">B</span>
                            <span className="text-[4em] hover:text-primary">E</span>
                            <img src={peachImage} alt="Peach" className="w-[6em] h-[6em] -mt-3" />
                        </div>
                        <div className="text-[1.2em] text-primary text-center pb-[1.5em] italic">
                            {globalDict.appSlogon}
                        </div>
                        <div className="text-sm text-muted-foreground text-center pb-[1.5em]">
                            <Link to="/read-terms-conditions">{globalDict.readTermsAndConditions}</Link>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="flex flex-col min-h-[3em] text-center justify-center">
                            <div>
                                <Button
                                    className="bg-primary text-white hover:bg-primary/80 min-w-[15em] mt-auto mx-auto"
                                    onClick={handleNextClick}
                                >
                                    {globalDict.acceptTermsAndLogin}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        </Page>
    );
}