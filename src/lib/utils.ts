import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

export function getBiasSeverity(score: number): 'low' | 'moderate' | 'high' {
    if (score < 33) return 'low';
    if (score < 67) return 'moderate';
    return 'high';
}

export function getBiasColor(biasType: string): string {
    const colors: Record<string, string> = {
        overconfidence: 'coral',
        anchoring: 'teal',
        lossAversion: 'purple',
        herding: 'blue',
        confirmation: 'amber',
        statusQuo: 'rose',
    };
    return colors[biasType] || 'gray';
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
