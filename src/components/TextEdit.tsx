import type { FC } from 'react';
import { Textarea } from "@/components/ui/textarea"

interface TextEditProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export const TextEdit: FC<TextEditProps> = ({ 
    label, 
    placeholder, 
    value, 
    onChange,
    className = ""
}) => {
    return (
        <div className={className}>
            {label && <span className="text-sm text-foreground/40 px-1">{label}</span>}
            <Textarea 
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    );
}; 