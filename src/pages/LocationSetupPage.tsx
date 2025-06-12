import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Page } from '@/components/Page.tsx';
import { Content, ContentHeader } from '@/components/Content';
import { Button } from '@/components/ui/button';
import { LocationInput } from '@/components/LocationInput';

import { globalDict } from '@/locale/en-US';
import { Select, SelectGroup, SelectContent, SelectValue, SelectTrigger, SelectLabel, SelectItem } from '@/components/ui/select';

export const LocationSetupPage: FC = () => {
    const navigate = useNavigate();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    
    const [locationMode, setLocationMode] = useState<'automatic' | 'manual'>('automatic');
    const [randomizationRadius, setRandomizationRadius] = useState<number>(1);
    const [manualLocation, setManualLocation] = useState<string>('');
    const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    // Initialize map
    useEffect(() => {
        if (mapContainer.current && !map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-74.5, 40], // Default center
                zoom: 9
            });

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Update marker when location changes
    useEffect(() => {
        if (selectedCoordinates && map.current) {
            // Remove existing marker if any
            if (marker.current) {
                marker.current.remove();
            }

            // Add new marker
            marker.current = new mapboxgl.Marker()
                .setLngLat([selectedCoordinates.lng, selectedCoordinates.lat])
                .addTo(map.current);

            // Center map on selected location
            map.current.flyTo({
                center: [selectedCoordinates.lng, selectedCoordinates.lat],
                zoom: 12
            });
        }
    }, [selectedCoordinates]);

    const handleNextPageClick = () => {
        navigate('demo-index');
    }

    const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
        setSelectedCoordinates({ lat: location.lat, lng: location.lng });
    };

    return (
        <Page back={true}>
            <Content className='text-md'>
                <div className="grid grid-cols-2 grid-rows-[auto_auto_auto_1fr_auto] w-full h-full gap-2">
                    <div className="col-span-2">
                        <ContentHeader text={globalDict.yourLocation} />
                    </div>
                    <div className="col-span-2">
                        <span className="text-sm text-foreground/40 px-1">Select Location Mode</span>
                        <div className="flex gap-2">
                            <Button
                                variant={locationMode === 'automatic' ? 'default' : 'outline'} 
                                onClick={() => setLocationMode('automatic')}
                                className="flex-1"
                                disabled={locationMode === undefined}
                            >
                                Automatic Location
                            </Button>
                            <Button
                                variant={locationMode === 'manual' ? 'default' : 'outline'}
                                onClick={() => setLocationMode('manual')} 
                                className="flex-1"
                                disabled={locationMode === undefined}
                            >
                                Manual Location
                            </Button>
                        </div>
                    </div>
                    {locationMode === 'automatic' ? (
                        <div className="col-span-2">
                            <span className="text-sm text-foreground/40 px-1">Hide my accurate location by randomizing it by:</span>
                                <div className="flex items-center space-x-4">
                                    <Select value={randomizationRadius.toString()} onValueChange={(value) => setRandomizationRadius(Number(value))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select radius" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Radius (km)</SelectLabel>
                                                {[0, 1, 5, 10].map(value => (
                                                    <SelectItem key={value} value={value.toString()}>{value} Km</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                        </div>
                    ) : (
                        <div className="col-span-2">
                            <span className="text-sm text-foreground/40 px-1">Enter your location</span>
                            <LocationInput
                                value={manualLocation}
                                onChange={setManualLocation}
                                onLocationSelect={handleLocationSelect}
                            />
                        </div>
                    )}

                    {selectedCoordinates && (
                        <div className="col-span-2">
                            <div className='flex flex-col h-full'>
                                <span className="text-sm text-foreground/40 px-1">Your location as it will appear:</span>
                                <div className="grow rounded-lg border border-border">
                                    <div ref={mapContainer} className="h-full" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-span-2">
                        <div className="flex flex-col min-h-[3em] text-center justify-center">
                            <div>
                                <Button
                                    className="bg-primary text-white hover:bg-primary/80 min-w-[15em] mt-auto mx-auto"
                                    onClick={handleNextPageClick}
                                    disabled={locationMode === 'manual' && (!manualLocation.trim() || !selectedCoordinates)}
                                    >
                                    {globalDict.next} ❯
                                </Button>
                            </div>
                        </div>
                    </div>                    
                </div>
            </Content>
        </Page>
    );
} 
