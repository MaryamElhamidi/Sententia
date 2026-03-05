import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: 'teal' | 'coral' | 'purple' | 'none';
}

export function Card({ children, className, hover = false, gradient = 'none' }: CardProps) {
    const gradients = {
        teal: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200',
        coral: 'bg-gradient-to-br from-coral-50 to-coral-100 border-coral-200',
        purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
        none: 'bg-white border-gray-200',
    };

    return (
        <div
            className={cn(
                'rounded-2xl border shadow-card transition-all duration-300',
                hover && 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
                gradients[gradient],
                className
            )}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('p-6 pb-4', className)}>
            {children}
        </div>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn('p-6 pt-0', className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
    return (
        <h3 className={cn('text-xl font-bold text-gray-900', className)}>
            {children}
        </h3>
    );
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm text-gray-600 mt-1', className)}>
            {children}
        </p>
    );
}
