import { FC, ReactNode } from 'react';
import { useSignal } from '@telegram-apps/sdk-react';
import { viewportSafeAreaInsets } from '@telegram-apps/sdk';

interface ContentProps {
    children: ReactNode;
    className?: string;
    itemsAlign?: 'center' | 'left' | 'right';
    extraTopPadding?: number;
}

export const Content: FC<ContentProps> = ({ children, className = '', itemsAlign = 'center', extraTopPadding = 38 }) => {
    const safeInsets = useSignal(viewportSafeAreaInsets) ?? { top: 0, bottom: 0, left: 0, right: 0 };

    return (
        <div 
            className={`relative h-full flex flex-col items-${itemsAlign} justify-end ${className}`}
            style={{
                paddingTop: `${extraTopPadding + safeInsets.top}px`,
                paddingBottom: `${safeInsets.bottom}px`,
                paddingLeft: `${3 + safeInsets.left}px`,
                paddingRight: `${3 + safeInsets.right}px`,
            }}
        >
            <div className='h-full w-full border-2 border-green-200'>
                {children}
            </div>
        </div>
    );
}; 