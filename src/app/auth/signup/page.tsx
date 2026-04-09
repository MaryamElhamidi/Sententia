'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Brain, FileLock2 } from 'lucide-react';
import { registerAccount } from '@/lib/authClient';

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConsentPolicy, setShowConsentPolicy] = useState(false);
    const [policyReadAck, setPolicyReadAck] = useState(false);
    const [policyScrollComplete, setPolicyScrollComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'candidate' as 'candidate' | 'manager' | 'admin',
        consentData: false,
        consentTerms: false,
    });

    const handleConsentScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 8) {
            setPolicyScrollComplete(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!policyReadAck) {
            setError('You must review and acknowledge the PIPEDA consent policy.');
            return;
        }

        setIsSubmitting(true);
        const consentDate = new Date().toISOString().slice(0, 10);

        const result = registerAccount({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            consentGiven: formData.consentData && formData.consentTerms && policyReadAck,
            consentDate
        });

        if (!result.ok) {
            setError(result.error || 'Unable to create account.');
            setIsSubmitting(false);
            return;
        }

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
                            <button
                                type="button"
                                className="w-full text-left p-3 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 text-sm"
                                onClick={() => setShowConsentPolicy(true)}
                            >
                                <span className="inline-flex items-center gap-2 font-medium">
                                    <FileLock2 className="w-4 h-4" />
                                    Review Digital Health Technology + PIPEDA consent policy
                                </span>
                            </button>

                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={policyReadAck}
                                    onChange={(e) => setPolicyReadAck(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    required
                                />
                                <span className="text-sm text-gray-700">
                                    I confirm I reviewed the PIPEDA consent policy and understand my rights.
                                </span>
                            </label>

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

                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}

                        <Button type="submit" variant="primary" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
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

            {showConsentPolicy && (
                <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col">
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="text-xl font-display font-bold text-gray-900">Digital Health Technology Informed Consent</h3>
                            <p className="text-sm text-gray-600 mt-1">Scroll to the end to enable acknowledgement.</p>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[55vh] space-y-4 text-sm text-gray-700" onScroll={handleConsentScroll}>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">Purpose</h4>
                                <p>This application collects cognitive task responses to identify potential cognitive biases. Data is processed by a machine learning model that categorizes patterns into bias profiles. The goal is personal development, not clinical diagnosis.</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">What is collected</h4>
                                <p>Task response times, answer patterns, and self-reported reflections. No medical data, no employment data.</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">How it is used</h4>
                                <p>Data trains and runs the bias classification model. Your profile is shown only to you. No data is sold or shared with third parties.</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">Your rights under PIPEDA</h4>
                                <p>You may withdraw consent at any time. Withdrawing removes your data from future processing but audit logs are retained per legal obligation. You may request a copy of your data or its deletion.</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">Employment status</h4>
                                <p>Participation does not affect your employment in any way.</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">Risks</h4>
                                <p>Bias labels are probabilistic, not definitive. Misidentification is possible. This is not a clinical or diagnostic tool.</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">Benefits</h4>
                                <p>You gain a personalized view of cognitive tendencies and access to targeted improvement activities.</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">Data retention</h4>
                                <p>Profile data retained for 12 months from last activity. Consent audit logs retained per PIPEDA requirements (minimum 1 year).</p>
                            </section>
                            <section>
                                <h4 className="font-semibold text-gray-900 mb-1">Technology used</h4>
                                <p>A supervised ML model categorizes responses into bias profiles. You are not making employment or health decisions based solely on this output.</p>
                            </section>
                        </div>

                        <div className="p-4 border-t border-gray-200 flex items-center justify-between gap-3">
                            <span className="text-xs text-gray-500">
                                {policyScrollComplete ? 'Policy review complete.' : 'Scroll to the end to enable acknowledgement.'}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="ghost" onClick={() => setShowConsentPolicy(false)}>
                                    Close
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    disabled={!policyScrollComplete}
                                    onClick={() => {
                                        setPolicyReadAck(true);
                                        setShowConsentPolicy(false);
                                    }}
                                >
                                    I Have Reviewed
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
