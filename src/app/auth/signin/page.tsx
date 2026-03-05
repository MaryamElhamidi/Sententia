'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Brain } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock signin - redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 text-center text-white max-w-md">
                    <h1 className="text-5xl font-display font-bold mb-6">Welcome Back!</h1>
                    <p className="text-xl text-purple-100 mb-8">
                        Continue your journey toward better decision-making
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <p className="text-lg">
                            "Self-awareness is the foundation of personal growth."
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream-50">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold text-gray-900">Sententia</span>
                    </Link>

                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
                            Sign In
                        </h2>
                        <p className="text-gray-600">
                            Access your cognitive insights and activities
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="sarah@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                />
                                <span className="text-gray-700">Remember me</span>
                            </label>
                            <Link href="/auth/forgot-password" className="text-teal-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" variant="primary" className="w-full" size="lg">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-cream-50 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Microsoft</span>
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-teal-600 font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
