import React from 'react';
import { useSignal } from '@telegram-apps/sdk-react';
import { viewportSafeAreaInsets } from '@telegram-apps/sdk';

interface ContentFeedProps {
    children?: React.ReactNode;
    extraTopPadding?: number;
}

export const ContentFeed: React.FC<ContentFeedProps> = ({ children, extraTopPadding = 60 }) => {
    const safeInsets = useSignal(viewportSafeAreaInsets) ?? { top: 0, bottom: 0, left: 0, right: 0 };

    return (
        <main className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="max-w-lg mx-auto px-4 py-4"
                style={{
                    marginBottom: `${extraTopPadding + safeInsets.bottom}px`,
                }}>
                {children}
            </div>
        </main>
    );
}; 