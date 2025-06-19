import React from 'react';

interface MessageCountBadgeProps {
    count: number;
    className?: string;
}

export const MessageCountBadge: React.FC<MessageCountBadgeProps> = ({
    count,
    className = ""
}) => {
    if (count <= 0) {
        return null;
    }

    return (
        <div className={`flex-shrink-0 ${className}`}>
            <div className="bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {count > 99 ? '99+' : count}
            </div>
        </div>
    );
}; 