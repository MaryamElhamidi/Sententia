'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { mockTeams, mockTeamAnalytics } from '@/lib/mockData';
import { Users, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function AdminPage() {
    return (
        <div className="flex min-h-screen bg-cream-50">
            <Sidebar userRole="admin" />

            <div className="flex-1">
                <Header userName="Emma Williams" />

                <main className="p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-lg text-gray-600">
                            Team analytics and cognitive diversity insights
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <Card gradient="teal">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Teams</p>
                                        <p className="text-3xl font-bold text-gray-900">{mockTeams.length}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-teal-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card gradient="coral">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Avg Diversity</p>
                                        <p className="text-3xl font-bold text-gray-900">{mockTeamAnalytics.cognitiveDiversity}</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-coral-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card gradient="purple">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Balance Score</p>
                                        <p className="text-3xl font-bold text-gray-900">{mockTeamAnalytics.balanceScore}</p>
                                    </div>
                                    <Target className="w-8 h-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Active Users</p>
                                        <p className="text-3xl font-bold text-gray-900">24</p>
                                    </div>
                                    <Users className="w-8 h-8 text-gray-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Team Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Teams Overview</CardTitle>
                                <CardDescription>Current team composition and status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockTeams.map((team) => (
                                        <div key={team.id} className="p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                                                <span className="text-sm text-gray-600">{team.members.length} members</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{team.description}</p>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex -space-x-2">
                                                    {team.members.slice(0, 4).map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                                                        >
                                                            {String.fromCharCode(65 + idx)}
                                                        </div>
                                                    ))}
                                                </div>
                                                {team.members.length > 4 && (
                                                    <span className="text-sm text-gray-500">+{team.members.length - 4} more</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bias Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cognitive Bias Distribution</CardTitle>
                                <CardDescription>Average scores across Product Development team</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockTeamAnalytics.biasDistribution.map((bias) => (
                                        <div key={bias.biasType}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {bias.biasType.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <span className="text-sm text-gray-600">{bias.averageScore}/100</span>
                                            </div>
                                            <ProgressBar
                                                value={bias.averageScore}
                                                color={bias.averageScore > 60 ? 'coral' : bias.averageScore > 40 ? 'purple' : 'teal'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recommendations */}
                    <Card className="mt-8" gradient="teal">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5 text-teal-700" />
                                <CardTitle>Team Recommendations</CardTitle>
                            </div>
                            <CardDescription>AI-powered insights for team optimization</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockTeamAnalytics.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-teal-200">
                                        <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-700">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cognitive Diversity Score */}
                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <Card gradient="purple">
                            <CardHeader>
                                <CardTitle>Cognitive Diversity Score</CardTitle>
                                <CardDescription>Measures variety in decision-making styles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-purple-600 text-white mb-4">
                                        <span className="text-4xl font-bold">{mockTeamAnalytics.cognitiveDiversity}</span>
                                    </div>
                                    <p className="text-gray-700 font-medium">Excellent Diversity</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        This team has a healthy mix of cognitive profiles, promoting balanced decision-making
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card gradient="coral">
                            <CardHeader>
                                <CardTitle>Team Balance Score</CardTitle>
                                <CardDescription>Overall team composition quality</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-coral-500 text-white mb-4">
                                        <span className="text-4xl font-bold">{mockTeamAnalytics.balanceScore}</span>
                                    </div>
                                    <p className="text-gray-700 font-medium">Well Balanced</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Team members complement each other's strengths and blind spots effectively
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
