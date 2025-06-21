import { createContext, useContext, useMemo, ReactNode } from 'react';
import { initData as tgInitData } from '@telegram-apps/sdk-react';
import { hashStringToId } from '@/utils/generator';

interface UserData {
    userId: string;
    platform: string;
    platformId: number;
}

interface UserContextType {
    userData: UserData | null;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const userData = useMemo<UserData | null>(() => {
        try {
            const tgUser = tgInitData.user();
            
            if (!tgUser?.id) {
                return null;
            }

            // Create userId by hashing platform:platformId to base64
            const platform = 'tg';
            const platformId = tgUser.id;
            const platformIdString = `${platform}:${String(platformId)}`;
            const userId = hashStringToId(platformIdString);

            return {
                userId,
                platform,
                platformId,
            };
        } catch (error) {
            console.error('Error creating user data:', error);
            return null;
        }
    }, []);

    const isLoading = useMemo(() => {
        // Loading is false once we've attempted to get user data
        return false;
    }, []);

    const value = {
        userData,
        isLoading
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
