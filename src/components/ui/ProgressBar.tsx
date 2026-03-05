import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number; // 0-100
    className?: string;
    color?: 'teal' | 'coral' | 'purple';
    showLabel?: boolean;
}

export function ProgressBar({
    value,
    className,
    color = 'teal',
    showLabel = false
}: ProgressBarProps) {
    const colors = {
        teal: 'bg-teal-600',
        coral: 'bg-coral-500',
        purple: 'bg-purple-600',
    };

    return (
        <div className={cn('w-full', className)}>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-sm text-gray-600 mt-1 text-right">{Math.round(value)}%</p>
            )}
        </div>
    );
}
