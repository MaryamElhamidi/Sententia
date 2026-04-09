'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
    userName: string;
    userAvatar?: string;
}

export function Header({ userName, userAvatar }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            suppressHydrationWarning
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* User section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button suppressHydrationWarning className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-coral-500 rounded-full"></span>
                    </button>

                    {/* User profile */}
                    <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{userName}</p>
                            <p className="text-xs text-gray-500">Your profile</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-medium">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
