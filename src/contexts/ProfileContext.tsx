import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { LocalStorage as Storage } from '@/utils/local-storage';
//import { CloudStorage as Storage} from '@/utils/cloud-storage';
import { StorageKeys } from '@/config';

import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

import { ProfileDB, ProfileId, SelfProfileRecord, createProfileRecord, upcastSelfProfileRecord } from '@/types/profile';
import { profileApi } from '@/api/profiles';


interface ProfileContextType {
    profileDB: ProfileDB | null;
    delProfileRecord: (record: SelfProfileRecord) => Promise<void>;
    addProfileRecord: (record: SelfProfileRecord) => Promise<void>;
    updateProfileRecord: (record: SelfProfileRecord, updateRemote: boolean) => Promise<void>;
    setActiveProfileId: (profileId: ProfileId) => Promise<void>;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
    children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
    const [profileDB, setProfileDB] = useState<ProfileDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { profileIds } = useUser();
    const locale = useLanguage();

    const loadProfileDB = async () => {
      if (!profileIds || profileIds.length === 0) return;

      let activeProfileId: ProfileId | null = null;
      let profilesRecords: Record<ProfileId, SelfProfileRecord> = {};

      try {
        activeProfileId = await Storage.getItem(StorageKeys.Profiles + '/activeProfileId');
        profilesRecords = {};
        for (const profileId of profileIds) {
          const record = await Storage.getItem<SelfProfileRecord>(StorageKeys.Profiles + `/profileRecords/${profileId}`);
          if (record !== null && record.profileId && profileIds.includes(record.profileId)) {
            profilesRecords[profileId] = record;
          }
        }

        if (!activeProfileId || !profilesRecords[activeProfileId]) {
            activeProfileId = profileIds[0];
            profilesRecords[activeProfileId] = createProfileRecord(locale, activeProfileId);
            Storage.setItem(StorageKeys.Profiles + '/activeProfileId', activeProfileId);
            Storage.setItem(StorageKeys.Profiles + `/profileRecords/${activeProfileId}`, profilesRecords[activeProfileId]);
        }
      } catch (error) {
        activeProfileId = profileIds[0];
        profilesRecords[activeProfileId] = createProfileRecord(locale, activeProfileId);

        console.error('Error loading profile DB:', error);
      }

      const profileDB = {
        activeProfileId: activeProfileId,
        profileRecords: profilesRecords,
        freeProfileIds: profileIds.filter(id => !profilesRecords[id])
      };

      setProfileDB(profileDB);
      setIsLoading(false);
    }

    const saveProfileDB = (profileDB: ProfileDB) => {
      if (!profileDB) return;

      try {
        Storage.setItem(StorageKeys.Profiles + '/activeProfileId', profileDB.activeProfileId);
        for (const profileId in profileDB.profileRecords) {
          Storage.setItem(StorageKeys.Profiles + `/profileRecords/${profileId}`, profileDB.profileRecords[profileId]);
        }
      } catch (error) {
        console.error('Error saving profile DB:', error);
      }
    }

    useEffect(() => {
      loadProfileDB();
    }, [profileIds]);

    const delProfileRecord = async (record: SelfProfileRecord) => {
      const profileId = record.profileId;
      if (profileId && profileDB) {
        const newProfileRecords = { ...profileDB.profileRecords };
        delete newProfileRecords[profileId];

        const newFreeProfileIds = [...profileDB.freeProfileIds, profileId];

        // Determine new active profile
        let newActiveProfileId;
        const remainingProfileIds = Object.keys(newProfileRecords);

        if (remainingProfileIds.length > 0) {
          // Switch to first remaining profile
          newActiveProfileId = remainingProfileIds[0];
        } else {
          // No profiles left, create a new empty profile
          newActiveProfileId = newFreeProfileIds[0];
          const newEmptyProfile = createProfileRecord(locale, newActiveProfileId);
          newProfileRecords[newActiveProfileId] = newEmptyProfile;
          newFreeProfileIds.splice(0, 1);
        }

        const updatedProfileDB = {
          ...profileDB,
          profileRecords: newProfileRecords,
          freeProfileIds: newFreeProfileIds,
          activeProfileId: newActiveProfileId
        };

        // Delete from local storage
        Storage.deleteItem(StorageKeys.Profiles + `/profileRecords/${profileId}`);
        saveProfileDB(updatedProfileDB);
        setProfileDB(updatedProfileDB);

        // Delete from backend
        try {
          await profileApi.deleteProfile(profileId);
        } catch (error) {
          console.error(`Failed to delete profile ${profileId}:`, error);
          throw error;
        }
      }
    }

    const addProfileRecord = async (record: SelfProfileRecord) => {
      const profileId = profileDB?.freeProfileIds[0] || null;
      if (profileId && profileDB) {
        const newProfileRecord = createProfileRecord(locale, profileId, record);
        const newFreeProfileIds = profileDB.freeProfileIds.filter(id => id !== profileId);

        const updatedProfileDB = {
          ...profileDB,
          profileRecords: {
            ...profileDB.profileRecords,
            [profileId]: newProfileRecord
          },
          freeProfileIds: newFreeProfileIds,
          activeProfileId: profileId
        };

        // Save to local storage
        saveProfileDB(updatedProfileDB);
        setProfileDB(updatedProfileDB);

        // Create in backend
        try {
          await profileApi.upsertProfile(profileId, upcastSelfProfileRecord(newProfileRecord));
        } catch (error) {
          console.error(`Failed to create profile ${profileId} on remote:`, error);
          throw error;
        }
      }
    }

    const updateProfileRecord = async (record: SelfProfileRecord, updateRemote: boolean = true) => {
      const profileId = record.profileId;
      if (profileId && profileDB) {
        const updatedRecord = createProfileRecord(locale, profileId, record);

        const updatedProfileDB = {
          ...profileDB,
          profileRecords: {
            ...profileDB.profileRecords,
            [profileId]: updatedRecord
          }
        };
        console.log('updatedProfileDB', record, updateRemote);

        // Save to local storage
        saveProfileDB(updatedProfileDB);
        setProfileDB(updatedProfileDB);

        if (updateRemote) {
          try {
            await profileApi.upsertProfile(profileId, upcastSelfProfileRecord(updatedRecord));
          } catch (error) {
            console.error(`Failed to update profile ${profileId} on remote:`, error);
            throw error;
          }
        }
      }
    }

    const setActiveProfileId = async (profileId: ProfileId) => {
      if (profileId && profileDB) {
        const updatedProfileDB = {
          ...profileDB,
          activeProfileId: profileId
        };

        saveProfileDB(updatedProfileDB);
        setProfileDB(updatedProfileDB);
      }
    }

    const value = {
        profileDB,
        delProfileRecord,
        addProfileRecord,
        updateProfileRecord,
        setActiveProfileId,
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
