import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page.tsx';
import { Content } from '@/components/Content';
import { Link } from '@/components/Link/Link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

import peachImage from '@/assets/peach.png';

// import { Background } from '@/components/Background';

const styles = `
  .rotate-v {
  animation: rotateV 0.5s ease-out 1s forwards;
}

@keyframes rotateV {
  to { transform: rotate(-90deg); }
}
`;

export const SplashPage: FC = () => {
  const navigate = useNavigate();
  const { translations: { globalDict } } = useLanguage();

  const handleNextClick = () => {
    navigate('/profile', { state: { from: '/' } });
  }

  return (
    <Page back={false}>
      <style>{styles}</style>
      {/* <Background imageUrl="@/assets/login-bg-17.jpg" /> */}
      <Content>
        <div className="flex flex-col justify-end h-full text-center">
          <div>
            <div dir="ltr" className="flex justify-center text-gray-900 dark:text-white">
              <span className="text-[4em] hover:text-primary rotate-v">V</span>
              <span className="text-[4em] hover:text-primary">I</span>
              <span className="text-[4em] hover:text-primary">B</span>
              <span className="text-[4em] hover:text-primary">E</span>
              <img src={peachImage} alt="Peach" className="w-[6em] h-[6em] -mt-3" />
            </div>
            <div className="text-[1.2em] text-purple-400 italic mb-6">
              {globalDict.appSlogon}
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              <Link to="/read-terms-conditions">{globalDict.readTermsAndConditions}</Link>
            </div>
          </div>
          <div className="mb-6">
            <Button
              className="min-w-[15em]"
              onClick={handleNextClick}
              variant="default"
            >
              {globalDict.acceptTermsAndLogin}
            </Button>
          </div>
        </div>
      </Content>
    </Page>
  );
}
