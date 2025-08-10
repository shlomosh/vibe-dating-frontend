import React from 'react';
import { useNavigate as useRouterNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
import { ContentNavigation } from "@/components/ContentNavigation";
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileNavigationBarProps {
  onValidate?: () => boolean;
}

export const ProfileNavigationBar: React.FC<ProfileNavigationBarProps> = ({ onValidate = undefined }) => {
  const navigate = useRouterNavigate();
  const location = useRouterLocation();
  const { translations: { globalDict }, direction } = useLanguage();
  const from = location.state?.from;

  const PrevArrowIcon = direction === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;
  const NextArrowIcon = direction === 'rtl' ? ArrowLeftIcon : ArrowRightIcon;

  const getNavigationItems = () => {
    if (from === '/') {
      return [
        {
          icon: PrevArrowIcon,
          label: globalDict.back,
          onClick: () => navigate(-1)
        },
        {
          icon: NextArrowIcon,
          label: globalDict.next,
          onValidate: onValidate,
          onClick: () => navigate('/location')
        }
      ];
    } else if (from === '/location') {
      return [
        {
          icon: PrevArrowIcon,
          label: globalDict.back,
          onClick: () => navigate(-1)
        },
        {
          icon: NextArrowIcon,
          label: globalDict.next,
          onValidate: onValidate,
          onClick: () => navigate('/radar')
        }
      ];
    } else {
      // Default case for any other 'from' value
      return [
        {
          icon: CheckIcon,
          label: globalDict.accept,
          onClick: () => navigate(-1)
        }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return <ContentNavigation items={navigationItems} />;
};

