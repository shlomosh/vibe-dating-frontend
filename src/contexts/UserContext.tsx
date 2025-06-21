import { createContext, useContext, useMemo, ReactNode } from 'react';
import { initData as tgInitData } from '@telegram-apps/sdk-react';

interface UserData {
    platform: 'telegram';
    platform_id: number;
    user_id: string;
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

            // Create user_id by hashing platform:platform_id to base64
            const platformString = `telegram:${tgUser.id}`;
            const user_id = btoa(platformString);

            return {
                platform: 'telegram' as const,
                platform_id: tgUser.id,
                user_id
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
