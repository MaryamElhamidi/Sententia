'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockCognitiveProfile, mockDebiasingActivities, mockAssessmentTasks } from '@/lib/mockData';
import { Brain, TrendingUp, Target, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const completedTasks = mockAssessmentTasks.filter(t => t.completed).length;
    const totalTasks = mockAssessmentTasks.length;
    const completionPercentage = (completedTasks / totalTasks) * 100;

    return (
        <div className="flex min-h-screen bg-cream-50">
            <Sidebar userRole="candidate" />

            <div className="flex-1">
                <Header userName="Sarah Johnson" />

                <main className="p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                            Welcome back, Sarah! 👋
                        </h1>
                        <p className="text-lg text-gray-600">
                            Here's your cognitive development journey
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card gradient="teal">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Assessment Progress</p>
                                        <p className="text-3xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
                                        <Brain className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <ProgressBar value={completionPercentage} color="teal" className="mt-4" />
                            </CardContent>
                        </Card>

                        <Card gradient="coral">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                                        <p className="text-3xl font-bold text-gray-900">{mockCognitiveProfile.overallScore}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-coral-500 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Balanced decision-maker</p>
                            </CardContent>
                        </Card>

                        <Card gradient="purple">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Active Activities</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {mockDebiasingActivities.filter(a => !a.completed).length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Keep up the great work!</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Cognitive Profile Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Cognitive Profile</CardTitle>
                                    <CardDescription>
                                        Based on {completedTasks} completed assessments
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockCognitiveProfile.biasScores.map((bias) => (
                                            <div key={bias.biasType}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                                        {bias.biasType.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className={`text-sm font-medium px-2 py-1 rounded-lg ${bias.severity === 'low' ? 'bg-green-100 text-green-700' :
                                                        bias.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {bias.severity}
                                                    </span>
                                                </div>
                                                <ProgressBar
                                                    value={bias.score}
                                                    color={bias.severity === 'high' ? 'coral' : bias.severity === 'moderate' ? 'purple' : 'teal'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/dashboard/insights">
                                        <Button variant="outline" className="w-full mt-6">
                                            View Detailed Insights
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Strengths & Blind Spots */}
                            <Card gradient="teal">
                                <CardHeader>
                                    <CardTitle>Key Insights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                                            Strengths
                                        </h4>
                                        <ul className="space-y-1">
                                            {mockCognitiveProfile.strengths.map((strength, idx) => (
                                                <li key={idx} className="text-sm text-gray-700 pl-6">• {strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                            <Target className="w-4 h-4 text-coral-500 mr-2" />
                                            Growth Areas
                                        </h4>
                                        <ul className="space-y-1">
                                            {mockCognitiveProfile.blindSpots.map((spot, idx) => (
                                                <li key={idx} className="text-sm text-gray-700 pl-6">• {spot}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Continue Assessment */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Continue Your Assessment</CardTitle>
                                    <CardDescription>
                                        Complete all tasks to unlock your full profile
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockAssessmentTasks.slice(0, 3).map((task) => (
                                            <Link key={task.id} href={`/assessment/${task.id}`}>
                                                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer">
                                                    <div className="flex items-center space-x-3">
                                                        {task.completed ? (
                                                            <CheckCircle className="w-5 h-5 text-teal-600" />
                                                        ) : (
                                                            <Clock className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900">{task.title}</p>
                                                            <p className="text-sm text-gray-600">{task.duration} min</p>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link href="/assessment">
                                        <Button variant="primary" className="w-full mt-4">
                                            View All Assessments
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Recommended Activities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recommended for You</CardTitle>
                                    <CardDescription>
                                        Personalized de-biasing activities
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockDebiasingActivities.slice(0, 3).map((activity) => (
                                            <div key={activity.id} className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                                    <span className="text-xs px-2 py-1 rounded-lg bg-purple-200 text-purple-700">
                                                        {activity.duration} min
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                                                {activity.progress !== undefined && activity.progress > 0 && (
                                                    <ProgressBar value={activity.progress} color="purple" showLabel />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
