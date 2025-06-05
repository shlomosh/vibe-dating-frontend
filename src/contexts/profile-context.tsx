import { CloudStorage } from '@/utils/cloud-storage';
import { ProfileDB, defaultProfile } from '@/types/profile';
import { generateRandomProfileName } from '@/utils/generator';
import { initData as tgInitData } from '@telegram-apps/sdk-react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'vibe/settings/profile-db';

interface ProfileContextType {
  profileDB: ProfileDB | null;
  setProfileDB: (profileDB: ProfileDB) => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profileDB, setProfileDBState] = useState<ProfileDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileDB();
  }, []);

  const loadProfileDB = async () => {
    try {
      let db = await CloudStorage.getItem<ProfileDB>(STORAGE_KEY);
      
      if (!db) {
        db = {
          id: 'Anonymous',
          db: {
            'Anonymous': {
              ...defaultProfile,
              nickName: generateRandomProfileName(tgInitData.user()?.id || -1)
            }
          }
        };
        await CloudStorage.setItem(STORAGE_KEY, db);
      }
      
      setProfileDBState(db);
    } catch (error) {
      console.error('Error loading profile DB:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setProfileDB = async (newProfileDB: ProfileDB) => {
    try {
      await CloudStorage.setItem(STORAGE_KEY, newProfileDB);
      setProfileDBState(newProfileDB);
    } catch (error) {
      console.error('Error saving profile DB:', error);
    }
  };

  const value = {
    profileDB,
    setProfileDB,
    isLoading
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
