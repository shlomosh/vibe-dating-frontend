import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RadarIcon, ZapIcon, SlidersHorizontalIcon, UserIcon, HeartIcon, InboxIcon } from 'lucide-react';
import { ContentNavigation } from '@/components/ContentNavigation';

export const HomeNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigationClick = (label: string) => { 
    switch (label) {
      case 'Inbox':
        navigate('/inbox');
        break;
      case 'Radar':
        navigate('/home');
        break;
      case 'Filters':
        console.log('Filters page not implemented yet');
        break;
      case 'Likes':
        console.log('Likes page not implemented yet');
        break;
      case 'Feed':
        console.log('Feed page not implemented yet');
        break;
      case 'Profile':
        console.log('Profile page not implemented yet');
        break;
      default:
        console.log(`Navigation to ${label} not implemented yet`);
    }
  };

  // Determine active state based on current location
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { 
      icon: RadarIcon, 
      label: "Radar", 
      isActive: isActive('/home'),
      onClick: () => handleNavigationClick("Radar")
    },
    { 
      icon: SlidersHorizontalIcon, 
      label: "Filters",
      isActive: false,
      onClick: () => handleNavigationClick("Filters")
    },
    { 
      icon: HeartIcon, 
      label: "Likes",
      isActive: false,
      onClick: () => handleNavigationClick("Likes")
    },
    { 
      icon: InboxIcon, 
      label: "Inbox",
      isActive: isActive('/inbox'),
      onClick: () => handleNavigationClick("Inbox")
    },
    { 
      icon: ZapIcon, 
      label: "Feed",
      isActive: false,
      onClick: () => handleNavigationClick("Feed")
    },
    { 
      icon: UserIcon, 
      label: "Profile",
      isActive: false,
      onClick: () => handleNavigationClick("Profile")
    }
  ];

  return <ContentNavigation items={navigationItems} />;
}; 