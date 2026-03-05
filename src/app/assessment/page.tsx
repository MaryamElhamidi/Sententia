'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockAssessmentTasks } from '@/lib/mockData';
import { Brain, Clock, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AssessmentPage() {
    return (
        <div className="flex min-h-screen bg-cream-50">
            <Sidebar userRole="candidate" />

            <div className="flex-1">
                <Header userName="Sarah Johnson" />

                <main className="p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                            Cognitive Assessments
                        </h1>
                        <p className="text-lg text-gray-600">
                            Interactive tasks to understand your decision-making patterns
                        </p>
                    </div>

                    {/* Info Banner */}
                    <Card gradient="teal" className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">About These Assessments</h3>
                                    <p className="text-gray-700 mb-2">
                                        Our assessments use interactive scenarios to measure cognitive biases in a natural,
                                        game-like environment. There are no right or wrong answers—we're simply observing
                                        your decision-making patterns.
                                    </p>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>✓ Takes 10-20 minutes per assessment</li>
                                        <li>✓ No preparation needed</li>
                                        <li>✓ Results are private and constructive</li>
                                        <li>✓ Complete at your own pace</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assessment Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {mockAssessmentTasks.map((task, index) => {
                            const gradients = ['teal', 'coral', 'purple', 'none'] as const;
                            const gradient = gradients[index % gradients.length];

                            return (
                                <Card key={task.id} hover gradient={gradient}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient === 'teal' ? 'bg-teal-600' :
                                                    gradient === 'coral' ? 'bg-coral-500' :
                                                        gradient === 'purple' ? 'bg-purple-600' :
                                                            'bg-gray-600'
                                                }`}>
                                                {task.completed ? (
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                ) : (
                                                    <Brain className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                            {task.completed && (
                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <CardTitle>{task.title}</CardTitle>
                                        <CardDescription>{task.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{task.duration} min</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Brain className="w-4 h-4" />
                                                    <span className="capitalize">{task.biasType.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/assessment/${task.id}`}>
                                            <Button
                                                variant={task.completed ? "outline" : "primary"}
                                                className="w-full"
                                            >
                                                {task.completed ? 'Review Results' : 'Start Assessment'}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Coming Soon */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                            Coming Soon
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="opacity-60">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-400 flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <CardTitle>Confirmation Bias</CardTitle>
                                    <CardDescription>
                                        Explore how you seek and interpret information that confirms existing beliefs
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="opacity-60">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-400 flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <CardTitle>Status Quo Bias</CardTitle>
                                    <CardDescription>
                                        Understand your preference for maintaining current situations over change
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
