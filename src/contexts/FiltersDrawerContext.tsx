import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BodyTypeOptions, HostingTypeOptions, SexualPositionTypeOptions, SexualityTypeOptions } from '@/types/profile';
import { LocalStorage as Storage } from '@/utils/local-storage';
import { StorageKeys } from '@/config';

interface Filters {
  ageIsEnabled: boolean;
  ageValuesRange: [number, number];
  travelDistanceIsEnabled: boolean;
  travelDistanceValuesRange: [number, number];
  sexualPositionIsEnabled: boolean;
  sexualPositionValuesList: string[];
  bodyTypeIsEnabled: boolean;
  bodyTypeValuesList: string[];
  sexualityIsEnabled: boolean;
  sexualityValuesList: string[];
  hostingIsEnabled: boolean;
  hostingValuesList: string[];
}

interface FiltersDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  filters: Filters;
  setFilters: (filters: Filters) => Promise<void>;
  isLoading: boolean;
}

const FiltersDrawerContext = createContext<FiltersDrawerContextType | undefined>(undefined);

export const useFiltersDrawer = () => {
  const context = useContext(FiltersDrawerContext);
  if (context === undefined) {
    throw new Error('useFiltersDrawer must be used within a FiltersDrawerProvider');
  }
  return context;
};

interface FiltersDrawerProviderProps {
  children: ReactNode;
}

const defaultFilters: Filters = {
  ageIsEnabled: false,
  ageValuesRange: [18, 60],
  travelDistanceIsEnabled: false,
  travelDistanceValuesRange: [1, 50],
  sexualPositionIsEnabled: false,
  sexualPositionValuesList: [...SexualPositionTypeOptions],
  bodyTypeIsEnabled: false,
  bodyTypeValuesList: [...BodyTypeOptions],
  sexualityIsEnabled: false,
  sexualityValuesList: [...SexualityTypeOptions],
  hostingIsEnabled: false,
  hostingValuesList: [...HostingTypeOptions],
};

export const FiltersDrawerProvider: React.FC<FiltersDrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  const loadFilters = async () => {
    try {
      const savedFilters = await Storage.getItem<Filters>(StorageKeys.RadarFilters);
      if (savedFilters) {
        setFiltersState(savedFilters);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const setFilters = async (newFilters: Filters) => {
    try {
      await Storage.setItem(StorageKeys.RadarFilters, newFilters);
      setFiltersState(newFilters);
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  };

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <FiltersDrawerContext.Provider value={{
      isOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      filters,
      setFilters,
      isLoading
    }}>
      {children}
    </FiltersDrawerContext.Provider>
  );
};
