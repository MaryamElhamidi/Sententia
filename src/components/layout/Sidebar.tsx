'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { clearSession } from '@/lib/authClient';
import {
    Home,
    Brain,
    User,
    Users,
    Settings,
    LogOut,
    BarChart3,
    ListChecks
} from 'lucide-react';

interface SidebarProps {
    userRole: 'candidate' | 'manager' | 'admin';
}

export function Sidebar({ userRole }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const candidateLinks = [
        { href: '/dashboard', label: 'Personal Profile Dashboard', icon: Home },
        { href: '/assessment', label: 'Assessments', icon: Brain },
        { href: '/dashboard/insights', label: 'My Insights', icon: User },
        { href: '/dashboard/activities', label: 'De-biasing Activities', icon: ListChecks },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const adminLinks = [
        { href: '/admin', label: 'Overview', icon: Home },
        { href: '/admin/teams', label: 'Teams', icon: Users },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const links = userRole === 'admin' || userRole === 'manager' ? adminLinks : candidateLinks;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-display font-bold text-gray-900">Sententia</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                                isActive
                                    ? 'bg-teal-50 text-teal-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    suppressHydrationWarning
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-all duration-200"
                    onClick={() => {
                        clearSession();
                        router.push('/auth/signin');
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
}
