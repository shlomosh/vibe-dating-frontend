import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authApi } from '@/api/auth';

interface UserContextType {
    userId: string | null;
    profileIds: string[];
    isLoading: boolean;
    isAuthenticating: boolean;
    authenticate: () => Promise<void>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [profileIds, setProfileIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Check if user is already authenticated on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const authStatus = await authApi.getAuthentication();
                if (!!authStatus.userId) {
                    setUserId(authStatus.userId);
                    setProfileIds(authStatus.profileIds);
                } else {
                    setUserId(null);
                    setProfileIds([]);
                }
            } catch (error) {
                console.error('Failed to check auth status:', error);
                setUserId(null);
                setProfileIds([]);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const authenticate = async () => {
        setIsAuthenticating(true);
        try {
            const authData = await authApi.initializeTelegram();
            setUserId(authData.userId);
            setProfileIds(authData.profileIds);
        } catch (error) {
            console.error('Authentication failed:', error);
            setUserId(null);
            setProfileIds([]);
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            setUserId(null);
            setProfileIds([]);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = {
        userId,
        profileIds,
        isLoading,
        isAuthenticating,
        authenticate,
        logout
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
