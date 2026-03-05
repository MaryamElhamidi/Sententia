import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Brain, Users, Target, Shield, TrendingUp, CheckCircle } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-teal-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-display font-bold text-gray-900">Sententia</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/auth/signin">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link href="/auth/signup">
                            <Button variant="primary">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-6xl font-display font-bold text-gray-900 mb-6 animate-fade-in">
                        Understand Your{' '}
                        <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                            Cognitive Biases
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Sententia helps individuals and teams make better decisions through interactive assessments
                        and personalized insights—without judgment or labels.
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                        <Link href="/auth/signup">
                            <Button variant="primary" size="lg">
                                Start Your Journey
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" size="lg">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-teal-600">4+</p>
                        <p className="text-gray-600 mt-2">Cognitive Biases</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-teal-600">15min</p>
                        <p className="text-gray-600 mt-2">Average Assessment</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-teal-600">100%</p>
                        <p className="text-gray-600 mt-2">Privacy Focused</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
                        How Sententia Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A transparent, ethical approach to understanding decision-making patterns
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Card hover gradient="teal">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle>Interactive Assessments</CardTitle>
                            <CardDescription>
                                Engage with game-based tasks that measure real decision-making patterns, not test-taking ability
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card hover gradient="coral">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-coral-500 flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle>Personal Insights</CardTitle>
                            <CardDescription>
                                Receive constructive feedback on your cognitive profile with actionable de-biasing activities
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card hover gradient="purple">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle>Team Analytics</CardTitle>
                            <CardDescription>
                                Build balanced teams with diverse cognitive profiles and improve collaboration
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Trust Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                                Built on Trust & Transparency
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Sententia is designed with ethics at its core. We believe in empowering individuals
                                through self-awareness, not labeling or filtering them.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Full Consent Control</h3>
                                        <p className="text-gray-600">You decide how your data is used and who can see it</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">PIPEDA Compliant</h3>
                                        <p className="text-gray-600">We follow strict data protection regulations</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <TrendingUp className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Growth-Focused</h3>
                                        <p className="text-gray-600">Results framed as development opportunities, not judgments</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl p-12 text-center">
                            <p className="text-6xl mb-4">🧠</p>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Not a Diagnostic Tool
                            </h3>
                            <p className="text-gray-600">
                                Sententia measures decision-making tendencies to support growth and team balance—
                                it's not a mental health assessment or personality test.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <Card className="bg-gradient-to-br from-teal-600 to-teal-700 border-0 text-white">
                    <CardContent className="py-16 text-center">
                        <h2 className="text-4xl font-display font-bold mb-4">
                            Ready to Improve Your Decision-Making?
                        </h2>
                        <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
                            Join teams and individuals who are building better awareness and making smarter decisions.
                        </p>
                        <Link href="/auth/signup">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-white text-teal-700 hover:bg-cream-50"
                            >
                                Get Started Free
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-display font-bold text-gray-900">Sententia</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            © 2024 Sententia. Building better decisions through awareness.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
