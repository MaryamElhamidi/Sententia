import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg',
        secondary: 'bg-coral-500 text-white hover:bg-coral-600 shadow-md hover:shadow-lg',
        outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
