'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Brain } from 'lucide-react';
import Image from 'next/image';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'candidate' as 'candidate' | 'manager' | 'admin',
        consentData: false,
        consentTerms: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock signup - in production, this would call an API
        console.log('Signup data:', formData);
        // Redirect to dashboard based on role
        if (formData.role === 'admin' || formData.role === 'manager') {
            router.push('/admin');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 p-12 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 text-center text-white max-w-md">
                    <h1 className="text-5xl font-display font-bold mb-6">WELCOME</h1>
                    <p className="text-xl text-teal-100 mb-8">
                        Begin your journey to better decision-making and self-awareness
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <p className="text-lg">
                            "Understanding our cognitive biases is the first step toward making better decisions."
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
                            Create Your Account
                        </h2>
                        <p className="text-gray-600">
                            Join us in building better decision-making skills
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Sarah Johnson"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

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

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                I am a...
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['candidate', 'manager', 'admin'] as const).map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role })}
                                        className={`px-4 py-2 rounded-xl border-2 transition-all ${formData.role === role
                                                ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Consent Checkboxes */}
                        <div className="space-y-3 pt-2">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.consentData}
                                    onChange={(e) => setFormData({ ...formData, consentData: e.target.checked })}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    required
                                />
                                <span className="text-sm text-gray-700">
                                    I consent to my assessment data being used to generate my cognitive profile
                                </span>
                            </label>

                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.consentTerms}
                                    onChange={(e) => setFormData({ ...formData, consentTerms: e.target.checked })}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    required
                                />
                                <span className="text-sm text-gray-700">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-teal-600 hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-teal-600 hover:underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                        </div>

                        <Button type="submit" variant="primary" className="w-full" size="lg">
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-teal-600 font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
