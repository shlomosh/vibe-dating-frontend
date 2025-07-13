import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '@/api/auth';

interface UserContextType {
    userId: string | null;
    isLoading: boolean;
    isAuthenticating: boolean;
    authenticate: () => Promise<void>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Check if user is already authenticated on mount
    useEffect(() => {
        const checkAuthStatus = () => {
            const authStatus = authService.getAuthStatus();
            if (authStatus.isAuthenticated) {
                setUserId(authStatus.userId);
            } else {
                setUserId(null);
            }
            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const authenticate = async () => {
        setIsAuthenticating(true);
        try {
            const authData = await authService.initialize();
            setUserId(authData.userId);
        } catch (error) {
            console.error('Authentication failed:', error);
            setUserId(null);
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUserId(null);
    };

    const value = {
        userId,
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
