import { FC, ReactNode } from 'react';
import { useSignal } from '@telegram-apps/sdk-react';
import { viewportSafeAreaInsets } from '@telegram-apps/sdk';

interface ContentProps {
    children: ReactNode;
    className?: string;
    itemsAlign?: 'center' | 'left' | 'right';
}

export const Content: FC<ContentProps> = ({ children, className = '', itemsAlign = 'center' }) => {
    const safeInsets = useSignal(viewportSafeAreaInsets) ?? { top: 0, bottom: 0, left: 0, right: 0 };

    return (
        <div 
            className={`relative h-full flex flex-col items-${itemsAlign} justify-end ${className} mt-10`}
            style={{
                marginTop: `30px`,
                paddingTop: `${safeInsets.top}px`,
                paddingBottom: `${safeInsets.bottom}px`,
                paddingLeft: `${safeInsets.left}px`,
                paddingRight: `${safeInsets.right}px`,
            }}
        >
            {children}
        </div>
    );
}; 