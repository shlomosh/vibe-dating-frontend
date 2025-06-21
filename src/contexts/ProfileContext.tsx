import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initData as tgInitData } from '@telegram-apps/sdk-react';

import { LocalStorage as Storage } from '@/utils/local-storage';
//import { CloudStorage as Storage} from '@/utils/cloud-storage';

import { ProfileDB, defaultProfile } from '@/types/profile';
import { generateRandomId, generateRandomProfileNickNameSimple } from '@/utils/generator';

const STORAGE_KEY = 'vibe/config/profile-db';

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

    const loadProfileDB = async () => {
        try {
            let db = await Storage.getItem<ProfileDB>(STORAGE_KEY);

            if (!db) {
                const defaultProfileId = generateRandomId();
                db = {
                    id: defaultProfileId,
                    db: {
                        [defaultProfileId]: {
                            ...defaultProfile,
                            nickName: generateRandomProfileNickNameSimple(tgInitData.user()?.id || -1)
                        }
                    }
                };
                await Storage.setItem(STORAGE_KEY, db);
            }

            setProfileDBState(db);
        } catch (error) {
            console.error('Error loading profile DB:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfileDB();
    }, []);

    const setProfileDB = async (newProfileDB: ProfileDB) => {
        try {
            await Storage.setItem(STORAGE_KEY, newProfileDB);
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
