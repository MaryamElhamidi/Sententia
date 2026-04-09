'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Brain, ArrowRight, DollarSign, AlertCircle } from 'lucide-react';

const TOTAL_TRIALS = 10;
const MAX_PUMPS = 20;

export default function BartAssessment() {
    const router = useRouter();
    const [currentTrial, setCurrentTrial] = useState(0);
    const [pumps, setPumps] = useState(0);
    const [bank, setBank] = useState(0);
    const [balloonState, setBalloonState] = useState<'inflating' | 'burst' | 'collected'>('inflating');
    
    // Array to store behavioural data for each balloon attempt
    const [responses, setResponses] = useState<{ pumps: number; burst: boolean }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const progress = (currentTrial / TOTAL_TRIALS) * 100;
    
    // Points per pump 
    const POINTS_PER_PUMP = 5;
    const currentPotential = pumps * POINTS_PER_PUMP;

    // Balloon visual scaling based on pumps
    const balloonScale = 1 + (pumps * 0.15);

    const handlePump = () => {
        if (balloonState !== 'inflating') return;

        const newPumps = pumps + 1;
        
        // Probabilistic burst logic. 
        // In real BART, probability of explosion is 1 / (max_pumps - current_pumps).
        // For this demo, let's make it simpler but increasing with each pump.
        const burstChance = newPumps / MAX_PUMPS;
        const didBurst = Math.random() < burstChance;

        if (didBurst || newPumps >= MAX_PUMPS) {
            handleBurst(newPumps);
        } else {
            setPumps(newPumps);
        }
    };

    const handleBurst = (finalPumps: number) => {
        setBalloonState('burst');
        
        // Log the trial data (0 points earned for burst)
        const updatedResponses = [...responses, { pumps: finalPumps, burst: true }];
        setResponses(updatedResponses);

        // Move to next trial after delay
        setTimeout(() => advanceTrial(updatedResponses), 1500);
    };

    const handleCollect = () => {
        if (balloonState !== 'inflating' || pumps === 0) return;

        setBalloonState('collected');
        setBank((prev) => prev + currentPotential);

        // Log the trial data
        const updatedResponses = [...responses, { pumps, burst: false }];
        setResponses(updatedResponses);

        // Move to next trial after delay
        setTimeout(() => advanceTrial(updatedResponses), 1500);
    };

    const advanceTrial = async (currentResponses: { pumps: number; burst: boolean }[]) => {
        if (currentTrial < TOTAL_TRIALS - 1) {
            setCurrentTrial(currentTrial + 1);
            setPumps(0);
            setBalloonState('inflating');
        } else {
            // Task complete, submit data
            submitData(currentResponses);
        }
    };

    const submitData = async (finalResponses: { pumps: number; burst: boolean }[]) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/assessment/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: 'bart',
                    responses: finalResponses
                })
            });
            
            if (res.ok) {
                router.push('/dashboard/insights');
            } else {
                console.error('Failed to submit BART assessment');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error submitting BART data:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-cream-50">
            <Sidebar userRole="candidate" />
            <div className="flex-1">
                <Header userName="Sarah Johnson" />

                <main className="p-8 max-w-4xl mx-auto">
                    {/* Header Block */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold text-gray-900">
                                    Risk & Reward Task (BART)
                                </h1>
                                <p className="text-gray-600">
                                    Trial {Math.min(currentTrial + 1, TOTAL_TRIALS)} of {TOTAL_TRIALS}
                                </p>
                            </div>
                        </div>
                        <ProgressBar value={progress} color="purple" />
                    </div>

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Safe Banked Points</p>
                                    <p className="text-3xl font-bold text-green-600">{bank}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-green-200" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Current Balloon Points</p>
                                    <p className={`text-3xl font-bold ${balloonState === 'burst' ? 'text-red-500 line-through' : 'text-purple-600'}`}>
                                        {balloonState === 'burst' ? 0 : currentPotential}
                                    </p>
                                </div>
                                <Brain className="w-8 h-8 text-purple-200" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Game Interaction Area */}
                    <Card className="mb-8 bg-white border-2 border-dashed border-gray-200 relative overflow-hidden">
                        <CardContent className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                            
                            {/* Visual Balloon */}
                            <div className="relative w-full h-64 flex items-center justify-center mb-8">
                                {balloonState === 'inflating' && (
                                    <div 
                                        className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg transition-transform duration-200 ease-out flex items-center justify-center border-4 border-purple-700"
                                        style={{ 
                                            width: '80px', 
                                            height: '90px',
                                            transform: `scale(${balloonScale})`,
                                            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
                                        }}
                                    >
                                        <div className="absolute w-2 h-4 bg-purple-700 -bottom-3 rounded-b-md"></div>
                                    </div>
                                )}

                                {balloonState === 'burst' && (
                                    <div className="text-center animate-bounce">
                                        <p className="text-6xl mb-2">💥</p>
                                        <p className="text-xl font-bold text-red-600">POP!</p>
                                        <p className="text-sm text-gray-500">Points lost.</p>
                                    </div>
                                )}

                                {balloonState === 'collected' && (
                                    <div className="text-center animate-pulse">
                                        <p className="text-6xl mb-2">💰</p>
                                        <p className="text-xl font-bold text-green-600">Collected +{currentPotential}</p>
                                    </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex w-full max-w-sm gap-4">
                                <Button 
                                    onClick={handlePump} 
                                    disabled={balloonState !== 'inflating' || isSubmitting}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-14 text-lg font-bold transition-all hover:scale-105 active:scale-95"
                                >
                                    Pump (+5)
                                </Button>
                                <Button 
                                    onClick={handleCollect} 
                                    variant="outline"
                                    disabled={balloonState !== 'inflating' || pumps === 0 || isSubmitting}
                                    className="flex-1 border-2 border-green-500 text-green-700 hover:bg-green-50 h-14 text-lg font-bold"
                                >
                                    Collect
                                </Button>
                            </div>
                        </CardContent>

                        {/* Submission Overlay */}
                        {isSubmitting && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
                                <p className="font-bold text-purple-900 text-lg">Analyzing Risk Patterns...</p>
                            </div>
                        )}
                    </Card>

                    {/* Instruction Box */}
                    <Card gradient="purple">
                        <CardContent className="p-4">
                            <h3 className="font-bold text-gray-900 mb-1 flex items-center">
                                <InfoIcon /> 
                                How to Play
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Click <strong>Pump</strong> to inflate the balloon and earn 5 points per pump. 
                                Click <strong>Collect</strong> at any time to save your current balloon points to your safe bank. 
                                If the balloon <strong>POPS</strong> before you collect, you lose all points for that balloon!
                            </p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}

function InfoIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-purple-700">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
        </svg>
    )
}
