export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  mode: 'automatic' | 'manual';
  randomizationRadius?: number;
  lastUpdated?: number;
}
