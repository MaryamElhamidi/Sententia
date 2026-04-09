'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Brain, ArrowRight, ArrowLeft } from 'lucide-react';

const questions = [
    {
        id: 1,
        question: "The population of Bangladesh is greater than 100 million.",
        type: 'confidence' as const,
    },
    {
        id: 2,
        question: "The Amazon River is longer than the Nile River.",
        type: 'confidence' as const,
    },
    {
        id: 3,
        question: "The Great Wall of China is visible from space with the naked eye.",
        type: 'confidence' as const,
    },
    {
        id: 4,
        question: "Mount Everest is located in Nepal.",
        type: 'confidence' as const,
    },
    {
        id: 5,
        question: "The human brain uses approximately 20% of the body's energy.",
        type: 'confidence' as const,
    },
];

/**
 * OverconfidenceAssessment Component
 * 
 * Maps to the TaskUIView in the UML architecture. Handles capturing physical mouse/keyboard responses,
 * mapping the user's behavioural data, and submitting it back to the DataCollectionService for processing.
 */
export default function OverconfidenceAssessment() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ answer: boolean; confidence: number }[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState<boolean | null>(null);
    const [currentConfidence, setCurrentConfidence] = useState(50);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    /**
     * Primary action handler mapped to 'TaskUIView.submitResponse()' from UML.
     * Collects answers and iteratively advances logic. When evaluating the final task,
     * triggers the POST request to our newly constructed InsightEngine.
     */
    const handleNext = async () => {
        if (currentAnswer !== null) {
            // Append the latest behavioral choice selection to local state memory
            const newAnswers = [...answers, { answer: currentAnswer, confidence: currentConfidence }];
            setAnswers(newAnswers);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setCurrentAnswer(null);
                setCurrentConfidence(50);
            } else {
                // Assessment completed. Transition to loading state and submit to backend.
                setIsSubmitting(true);
                try {
                    // Send the batch of BehaviouralData to the DataCollectionService
                    const res = await fetch('/api/assessment/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            taskId: 'overconfidence',
                            responses: newAnswers
                        })
                    });
                    
                    if (res.ok) {
                        router.push('/dashboard/insights');
                    } else {
                        console.error('Failed to submit assessment');
                        setIsSubmitting(false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setIsSubmitting(false);
                }
            }
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            const prevAnswer = answers[currentQuestion - 1];
            setCurrentAnswer(prevAnswer.answer);
            setCurrentConfidence(prevAnswer.confidence);
            setAnswers(answers.slice(0, -1));
        }
    };

    return (
        <div className="flex min-h-screen bg-cream-50">
            <Sidebar userRole="candidate" />

            <div className="flex-1">
                <Header userName="Sarah Johnson" />

                <main className="p-8 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold text-gray-900">
                                    Confidence Calibration
                                </h1>
                                <p className="text-gray-600">
                                    Question {currentQuestion + 1} of {questions.length}
                                </p>
                            </div>
                        </div>
                        <ProgressBar value={progress} color="teal" />
                    </div>

                    {/* Question Card */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {questions[currentQuestion].question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* True/False Selection */}
                            <div className="mb-8">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Do you think this statement is true or false?
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setCurrentAnswer(true)}
                                        className={`p-6 rounded-xl border-2 transition-all ${currentAnswer === true
                                                ? 'border-teal-600 bg-teal-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <p className="text-2xl font-bold text-gray-900">True</p>
                                    </button>
                                    <button
                                        onClick={() => setCurrentAnswer(false)}
                                        className={`p-6 rounded-xl border-2 transition-all ${currentAnswer === false
                                                ? 'border-teal-600 bg-teal-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <p className="text-2xl font-bold text-gray-900">False</p>
                                    </button>
                                </div>
                            </div>

                            {/* Confidence Slider */}
                            {currentAnswer !== null && (
                                <div className="animate-fade-in">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        How confident are you in your answer?
                                    </p>
                                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm text-gray-600">Not confident</span>
                                            <span className="text-3xl font-bold text-teal-700">{currentConfidence}%</span>
                                            <span className="text-sm text-gray-600">Very confident</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={currentConfidence}
                                            onChange={(e) => setCurrentConfidence(parseInt(e.target.value))}
                                            className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentQuestion === 0}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleNext}
                            disabled={currentAnswer === null || isSubmitting}
                        >
                            {isSubmitting ? 'Analyzing...' : (currentQuestion === questions.length - 1 ? 'Complete' : 'Next')}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>

                    {/* Info Box */}
                    <Card gradient="teal" className="mt-8">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Tip:</strong> Answer honestly based on your current knowledge.
                                This assessment measures how well your confidence matches your accuracy, not your knowledge itself.
                            </p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
