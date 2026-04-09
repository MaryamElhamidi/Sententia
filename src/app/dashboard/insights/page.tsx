'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CognitiveProfile, BiasScore } from '@/lib/types';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Zap, Info } from 'lucide-react';
import Link from 'next/link';

/**
 * InsightsPage Component
 * 
 * Acts as the 'View Cognitive Bias Results UI' in the architecture.
 * This dashboard heavily utilizes Rich Aesthetics (gradients, animations, visual severity badges)
 * to communicate complex cognitive data accurately to the user.
 */
export default function InsightsPage() {
    // State to hold the fetched CognitiveProfile document from the Backend InsightEngine API
    const [profile, setProfile] = useState<CognitiveProfile | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * React Hook that triggers automatically on component mount to retrieve 
     * the compiled analysis from the backend layer.
     */
    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // Queries the Data Retrieval Layer to grab final metrics
                const res = await fetch('/api/insights');
                const data = await res.json();
                setProfile(data); // Stores the retrieved model
            } catch (error) {
                console.error("Failed to load insights", error);
            } finally {
                setLoading(false); // Clear the loading state to reveal UI
            }
        };

        fetchInsights();
    }, []);

    /**
     * Maps the textual severity level (Low, Moderate, High) to aesthetic 
     * Tailwind color themes (Green, Yellow, Coral).
     */
    const getSeverityBadge = (severity: string) => {
        const styles: Record<string, string> = {
            low: 'bg-green-100 text-green-700 border-green-200',
            moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            high: 'bg-coral-100 text-coral-700 border-coral-200'
        };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[severity as string] || styles.moderate}`}>
                {/* Embedded status indicator dot for accessibility/style */}
                <span className={`w-2 h-2 rounded-full mr-1.5 ${severity === 'low' ? 'bg-green-500' : severity === 'moderate' ? 'bg-yellow-500' : 'bg-coral-500'}`}></span>
                {severity.charAt(0).toUpperCase() + severity.slice(1)} Risk
            </span>
        );
    };

    /**
     * Resolves the string identifier of a bias to a highly contextual physical icon.
     */
    const getBiasIcon = (biasType: string) => {
        switch (biasType) {
            case 'overconfidence': return <TrendingUp className="w-6 h-6 text-coral-500" />;
            case 'anchoring': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case 'lossAversion': return <Zap className="w-6 h-6 text-purple-500" />;
            case 'herding': return <Brain className="w-6 h-6 text-teal-500" />;
            default: return <Info className="w-6 h-6 text-gray-500" />;
        }
    };

    // Render loading indicator while data fetches over the network
    if (loading) {
        return (
            <div className="flex min-h-screen bg-cream-50 items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // Render error protection block in case server logic fails
    if (!profile) {
        return (
            <div className="flex min-h-screen bg-cream-50 items-center justify-center">
                <p className="text-xl text-gray-500">Failed to load insights.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-cream-50">
            {/* Navigational frame components */}
            <Sidebar userRole="candidate" />
            <div className="flex-1">
                <Header userName="Sarah Johnson" />

                <main className="p-8 max-w-6xl mx-auto animate-fade-in text-gray-900">
                    
                    {/* Header Region: Highlights the synthesized overall harmonious output */}
                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                                Deep Cognitive Insights 🧠
                            </h1>
                            <p className="text-lg text-gray-600">
                                Uncover the patterns behind your decision-making processes.
                            </p>
                        </div>
                        <div className="px-6 py-4 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-sm">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Overall Harmony Score</p>
                                <p className="text-3xl font-bold text-gray-900">{profile.overallScore}<span className="text-lg font-medium text-gray-500">/100</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Bias Breakdown Section: Iterates over the bias map to render data blocks */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual Bias Breakdown</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* Dynamically generates mapped UI cards for each known bias captured from backend */}
                            {profile.biasScores.map((bias: BiasScore) => (
                                <div key={bias.biasType} className="group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                                        
                                        {/* Colored contextual top-border using tailwind gradients */}
                                        <div className={`h-2 w-full bg-gradient-to-r ${bias.severity === 'high' ? 'from-coral-400 to-coral-500' : bias.severity === 'moderate' ? 'from-yellow-400 to-yellow-500' : 'from-teal-400 to-teal-500'}`} />
                                        
                                        <div className="p-6">
                                            {/* Bias Header: Icon, Formatting name camelcase, and Badges */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg bg-gray-50`}>
                                                        {getBiasIcon(bias.biasType)}
                                                    </div>
                                                    <h3 className="text-xl font-bold capitalize text-gray-900">
                                                        {bias.biasType.replace(/([A-Z])/g, ' $1').trim()}
                                                    </h3>
                                                </div>
                                                {getSeverityBadge(bias.severity)}
                                            </div>
                                            
                                            {/* Bias Progress Metrics: Provides numerical scale visuals */}
                                            <div className="mb-6 bg-gray-50 p-4 rounded-xl">
                                                <div className="flex justify-between text-sm mb-2 font-medium">
                                                    <span className="text-gray-600">Bias Intensity Score</span>
                                                    <span className="text-gray-900">{bias.score}/100</span>
                                                </div>
                                                <ProgressBar 
                                                    value={bias.score} 
                                                    color={bias.severity === 'high' ? 'coral' : bias.severity === 'moderate' ? 'purple' : 'teal'} 
                                                />
                                            </div>

                                            {/* Actionable Explanation from the Model */}
                                            <div className="flex items-start space-x-3">
                                                <Lightbulb className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-600 leading-relaxed text-sm">
                                                    {bias.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actionable Takeaways Area: Visualizes blindspots and strengths calculated by the engine */}
                    <div className="mt-12 grid lg:grid-cols-2 gap-8">
                        {/* Cognitive Strengths Card */}
                        <Card gradient="teal" className="transform transition-all hover:scale-[1.01] duration-300">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Cognitive Strengths</CardTitle>
                                <CardDescription className="text-teal-900">What you do exceptionally well</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {profile.strengths.map((str, i) => (
                                        <li key={i} className="flex items-start p-3 bg-white/60 rounded-xl">
                                            <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 border border-teal-200">
                                                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                                            </span>
                                            <span className="font-medium text-teal-900">{str}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Cognitive Blindspots (Calibration Points) Card */}
                        <Card gradient="coral" className="transform transition-all hover:scale-[1.01] duration-300">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Areas for Calibration</CardTitle>
                                <CardDescription className="text-coral-900">Where you could improve your judgment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {profile.blindSpots.map((spot, i) => (
                                        <li key={i} className="flex items-start p-3 bg-white/60 rounded-xl">
                                            <span className="w-6 h-6 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 border border-coral-200">
                                                <span className="w-2 h-2 rounded-full bg-coral-600"></span>
                                            </span>
                                            <span className="font-medium text-coral-900">{spot}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-10 text-center">
                        <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm">
                            Return to Dashboard
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
