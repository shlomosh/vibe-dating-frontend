import React from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { MultiSelect } from '@/components/ui/multi-select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useFiltersDrawer } from '@/contexts/FiltersDrawerContext';
import { BodyTypeOptions, HostingTypeOptions, PositionTypeOptions, SexualityTypeOptions } from '@/types/profile';
import { ContentNavigation } from '../../components/ContentNavigation';
import { XIcon, CheckIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContentFeed } from '../../components/ContentFeed';

export const FiltersDrawer: React.FC = () => {
    const { isOpen, closeDrawer, setFilters, filters } = useFiltersDrawer();
    const { translations: { profileDict, globalDict }, direction } = useLanguage();

    const handleApplyFilters = () => {
        closeDrawer();
    };

    const handleResetFilters = () => {
        setFilters({
            ageIsEnabled: false,
            ageValuesRange: [18, 60],
            travelDistanceIsEnabled: false,
            travelDistanceValuesRange: [1, 50],
            positionIsEnabled: false,
            positionValuesList: [],
            bodyTypeIsEnabled: false,
            bodyTypeValuesList: [],
            sexualityIsEnabled: false,
            sexualityValuesList: [],
            hostingIsEnabled: false,
            hostingValuesList: [],
        });
    };

    const handleFilterChange = (filterKey: string, value: any) => {
        setFilters({
            ...filters,
            [filterKey]: value
        });
    };

    // Convert options to MultiSelect format
    const positionOptions = PositionTypeOptions.map(value => ({
        label: profileDict.position.options[value],
        value
    }));

    const bodyTypeOptions = BodyTypeOptions.map(value => ({
        label: profileDict.body.options[value],
        value
    }));

    const sexualityOptions = SexualityTypeOptions.map(value => ({
        label: profileDict.sexuality.options[value],
        value
    }));

    const hostingOptions = HostingTypeOptions.map(value => ({
        label: profileDict.hosting.options[value],
        value
    }));

    return (
        <Drawer open={isOpen} onOpenChange={closeDrawer}>
            <DrawerContent dir={direction} className="h-[70vh]">
                <ContentFeed>
                    <DrawerHeader className="mb-6">
                        <DrawerTitle>{globalDict.filters}</DrawerTitle>
                        <DrawerDescription>
                            {globalDict.customizeYourRadarFeedPreferences}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid grid-cols-2 gap-y-6 items-start grid-cols-[25%_75%]">
                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="age-filter"
                                    checked={filters.ageIsEnabled || false}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => handleFilterChange('ageIsEnabled', checked)}
                                />
                                <Label htmlFor="age-filter" className="text-sm font-medium">
                                    {profileDict.age.label}
                                </Label>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-2">
                                <Slider
                                    disabled={!filters.ageIsEnabled}
                                    value={filters.ageValuesRange || [18, 99]}
                                    onValueChange={(value) => handleFilterChange('ageValuesRange', value)}
                                    min={18}
                                    max={99}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{filters.ageValuesRange?.[0] || 18} years</span>
                                    <span>{filters.ageValuesRange?.[1] || 60} years</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="position-filter"
                                    checked={filters.positionIsEnabled || false}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => handleFilterChange('positionIsEnabled', checked)}
                                />
                                <Label htmlFor="position-filter" className="text-sm font-medium">
                                    {profileDict.position.label}
                                </Label>
                            </div>
                        </div>
                        <div>
                            <MultiSelect
                                disabled={!filters.positionIsEnabled}
                                options={positionOptions}
                                value={filters.positionValuesList || []}
                                onValueChange={(value) => handleFilterChange('positionValuesList', value)}
                                placeholder=""
                                maxCount={5}
                                showSearch={false}
                                showSelectAll={false}
                                optionsClassName="min-w-[15rem]"
                            />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="hosting-filter"
                                    checked={filters.hostingIsEnabled || false}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => handleFilterChange('hostingIsEnabled', checked)}
                                />
                                <Label htmlFor="hosting-filter" className="text-sm font-medium">
                                    {profileDict.hosting.label}
                                </Label>
                            </div>
                        </div>
                        <div>
                            <MultiSelect
                                disabled={!filters.hostingIsEnabled}
                                options={hostingOptions}
                                value={filters.hostingValuesList || []}
                                onValueChange={(value) => handleFilterChange('hostingValuesList', value)}
                                placeholder=""
                                maxCount={5}
                                showSearch={false}
                                showSelectAll={false}
                                optionsClassName="min-w-[15rem]" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="travel-distance-filter"
                                    checked={filters.travelDistanceIsEnabled || false}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => handleFilterChange('travelDistanceIsEnabled', checked)}
                                />
                                <Label htmlFor="travel-distance-filter" className="text-sm font-medium">
                                    {profileDict.distance.label}
                                </Label>
                            </div>
                        </div>
                        <div>
                            <div className="space-y-2">
                                <Slider
                                    disabled={!filters.travelDistanceIsEnabled}
                                    value={filters.travelDistanceValuesRange || [1, 50]}
                                    onValueChange={(value) => handleFilterChange('travelDistanceValuesRange', value)}
                                    min={1}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{filters.travelDistanceValuesRange?.[0] || 1} km</span>
                                    <span>{filters.travelDistanceValuesRange?.[1] || 50} km</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="body-type-filter"
                                    checked={filters.bodyTypeIsEnabled || false}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => handleFilterChange('bodyTypeIsEnabled', checked)}
                                />
                                <Label htmlFor="body-type-filter" className="text-sm font-medium">
                                    {profileDict.body.label}
                                </Label>
                            </div>
                        </div>
                        <div>
                            <MultiSelect
                                disabled={!filters.bodyTypeIsEnabled}
                                options={bodyTypeOptions}
                                value={filters.bodyTypeValuesList || []}
                                onValueChange={(value) => handleFilterChange('bodyTypeValuesList', value)}
                                placeholder=""
                                maxCount={5}
                                showSearch={false}
                                showSelectAll={false}
                                optionsClassName="min-w-[15rem]" />
                        </div>

                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="sexuality-filter"
                                    checked={filters.sexualityIsEnabled || false}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => handleFilterChange('sexualityIsEnabled', checked)}
                                />
                                <Label htmlFor="sexuality-filter" className="text-sm font-medium">
                                    {profileDict.sexuality.label}
                                </Label>
                            </div>
                        </div>
                        <div>
                            <MultiSelect
                                disabled={!filters.sexualityIsEnabled}
                                options={sexualityOptions}
                                value={filters.sexualityValuesList || []}
                                onValueChange={(value) => handleFilterChange('sexualityValuesList', value)}
                                placeholder=""
                                maxCount={5}
                                showSearch={false}
                                showSelectAll={false}
                                optionsClassName="min-w-[15rem]" />
                        </div>
                    </div>
                </ContentFeed>
                <ContentNavigation items={[
                    {
                        icon: XIcon,
                        label: globalDict.reset,
                        onClick: handleResetFilters
                    },
                    {
                        icon: CheckIcon,
                        label: globalDict.apply,
                        onClick: handleApplyFilters
                    }
                ]} />
            </DrawerContent>
        </Drawer>
    );
}; 