import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { viewportSafeAreaInsets } from '@telegram-apps/sdk';
import { useSignal } from '@telegram-apps/sdk-react';

interface NavigationItem {
    icon: LucideIcon | undefined;
    label: string | React.ReactNode;
    isActive?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
}

interface ContentNavigationProps {
    items: NavigationItem[];
}

export const ContentNavigation: React.FC<ContentNavigationProps> = ({ items }) => {
    const safeInsets = useSignal(viewportSafeAreaInsets) ?? { top: 0, bottom: 0, left: 0, right: 0 };
    
    return (
        <nav className={cn(
            "fixed bottom-0 left-0 right-0 flex px-12 border-t bg-background z-50",
            items.length === 1 ? "justify-center" : "justify-between"
        )} style={{
            paddingTop: "0.75rem",
            paddingBottom: `max(0.75rem,${safeInsets.bottom}px)`,
        }}>
            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        className={cn(
                            "flex flex-col items-center gap-1",
                            item.isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer group"
                        )}
                        onClick={item.isDisabled ? undefined : item.onClick}
                    >
                        <div className={cn(
                            "rounded-full transition-all duration-200",
                            !item.isDisabled && "group-hover:text-primary",
                            item.isDisabled ? "text-muted-foreground" : (item.isActive ? "text-primary" : "text-foreground")
                        )}>
                            {Icon ? <Icon size={24} /> : <div className="w-6 h-6" />}
                        </div>
                        <div className={cn(
                            "text-xs transition-all duration-200",
                            !item.isDisabled && "group-hover:text-primary",
                            item.isDisabled ? "text-muted-foreground" : (item.isActive ? "text-primary" : "text-foreground")
                        )}>
                            {item.label}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
}; 