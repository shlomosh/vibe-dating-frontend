import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BodyTypeOptions, HostingTypeOptions, PositionTypeOptions, SexualityTypeOptions } from '@/types/profile';

interface Filters {
  ageIsEnabled: boolean;
  ageValuesRange: [number, number];
  travelDistanceIsEnabled: boolean;
  travelDistanceValuesRange: [number, number];
  positionIsEnabled: boolean;
  positionValuesList: string[];
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
  setFilters: (filters: Filters) => void;
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

export const FiltersDrawerProvider: React.FC<FiltersDrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ageIsEnabled: false,
    ageValuesRange: [18, 60],
    travelDistanceIsEnabled: false,
    travelDistanceValuesRange: [1, 50],
    positionIsEnabled: false,
    positionValuesList: [...PositionTypeOptions],
    bodyTypeIsEnabled: false,
    bodyTypeValuesList: [...BodyTypeOptions],
    sexualityIsEnabled: false,
    sexualityValuesList: [...SexualityTypeOptions],
    hostingIsEnabled: false,
    hostingValuesList: [...HostingTypeOptions],
  });

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
      setFilters 
    }}>
      {children}
    </FiltersDrawerContext.Provider>
  );
}; 