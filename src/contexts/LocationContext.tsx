import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { LocalStorage as Storage } from '@/utils/local-storage';
//import { CloudStorage as Storage} from '@/utils/cloud-storage';
import { StorageKeys } from '@/config';
import { Location } from '@/types/location';

/**
 * Location Context for managing user location data
 * 
 * This context provides:
 * - User's current location (latitude, longitude)
 * - Location mode (automatic/manual)
 * - Randomization radius for privacy
 * - Address information
 * - Last updated timestamp
 * 
 * The location is automatically saved to localStorage and persists across sessions.
 * 
 * Usage:
 * ```tsx
 * import { useLocation } from '@/contexts/LocationContext';
 * 
 * function MyComponent() {
 *   const { location, setLocation, isLoading, clearLocation } = useLocation();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   if (!location) {
 *     return <div>No location set</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Latitude: {location.latitude}</p>
 *       <p>Longitude: {location.longitude}</p>
 *       <p>Mode: {location.mode}</p>
 *     </div>
 *   );
 * }
 * ```
 */
interface LocationContextType {
    location: Location | null;
    setLocation: (location: Location) => Promise<void>;
    isLoading: boolean;
    clearLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | null>(null);

interface LocationProviderProps {
    children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
    const [location, setLocationState] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadLocation = async () => {
        try {
            const savedLocation = await Storage.getItem<Location>(StorageKeys.LocationDB);
            setLocationState(savedLocation);
        } catch (error) {
            console.error('Error loading location:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLocation();
    }, []);

    const setLocation = async (newLocation: Location) => {
        try {
            const locationWithTimestamp = {
                ...newLocation,
                lastUpdated: Date.now()
            };
            await Storage.setItem(StorageKeys.LocationDB, locationWithTimestamp);
            setLocationState(locationWithTimestamp);
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    const clearLocation = async () => {
        try {
            await Storage.deleteItem(StorageKeys.LocationDB);
            setLocationState(null);
        } catch (error) {
            console.error('Error clearing location:', error);
        }
    };

    const value = {
        location,
        setLocation,
        isLoading,
        clearLocation
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
} 