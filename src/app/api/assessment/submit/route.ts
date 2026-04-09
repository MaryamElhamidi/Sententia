import { NextResponse } from 'next/server';
import { mockCognitiveProfile, mockAssessmentTasks } from '@/lib/mockData';

// Constants represent the known "correct" truth for the mock assessment questions.
const CORRECT_ANSWERS = [true, false, false, true, true];

/**
 * POST /api/assessment/submit
 * 
 * Simulated endpoint acting as the DataCollectionService and InsightEngine in the architecture.
 * Processes the raw array of user responses, evaluates them against true outcomes, 
 * computes their Overconfidence Bias numeric score, and generates a dynamic insight block.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { taskId, responses } = body;

        // Artificial delay simulating complex database write/analysis queries
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validate payload structure
        if (!responses) {
            return NextResponse.json({ error: 'Invalid responses provided' }, { status: 400 });
        }

        // --- Simulated Insight Engine Logic ---
        let updatedInsight;
        let metrics;

        if (taskId === 'overconfidence') {
            let correctCount = 0;
            let totalConfidence = 0;

            responses.forEach((resp: { answer: boolean; confidence: number }, index: number) => {
                const isCorrect = resp.answer === CORRECT_ANSWERS[index];
                if (isCorrect) correctCount++;
                totalConfidence += resp.confidence;
            });

            const accuracyPattern = (correctCount / CORRECT_ANSWERS.length) * 100;
            const avgConfidence = totalConfidence / responses.length;
            const overconfidenceScore = Math.max(0, avgConfidence - accuracyPattern);

            let severity: 'low' | 'moderate' | 'high' = 'low';
            let description = 'You maintain a good balance between confidence and accuracy.';
            
            if (overconfidenceScore > 30) {
                severity = 'high';
                description = 'High discrepancy between confidence and actual accuracy. Consider practicing reflective hesitation before making final judgments.';
            } else if (overconfidenceScore > 15) {
                severity = 'moderate';
                description = 'Some overconfidence detected. It might be helpful to actively seek disconfirming evidence when you feel very sure.';
            }

            updatedInsight = {
                biasType: 'overconfidence',
                score: Math.round(overconfidenceScore),
                severity,
                description,
                timestamp: new Date().toISOString()
            };

            metrics = {
                accuracy: accuracyPattern,
                averageConfidence: avgConfidence
            };
        } else if (taskId === 'bart') {
            let totalUnpoppedPumps = 0;
            let unpoppedCount = 0;
            let burstCount = 0;

            // responses for BART is an array of trial objects: { pumps: number, burst: boolean }
            responses.forEach((trial: { pumps: number; burst: boolean }) => {
                if (trial.burst) {
                    burstCount++;
                } else {
                    totalUnpoppedPumps += trial.pumps;
                    unpoppedCount++;
                }
            });

            // Adjusted Average Pumps (accepted psychological metric for risk willingness)
            const adjustedAvgPumps = unpoppedCount > 0 ? (totalUnpoppedPumps / unpoppedCount) : 0;
            
            // Map risk willingness to a Loss Aversion index
            // Assuming max safe pumps per balloon average is around 15.
            // If they pump 0-4 times, that is high loss aversion (low risk tolerance).
            const lossAversionScore = Math.max(0, Math.min(100, Math.round(((15 - adjustedAvgPumps) / 15) * 100)));

            let severity: 'low' | 'moderate' | 'high' = 'low';
            let description = 'You display balanced risk-taking and are not overly averse to loss.';

            if (adjustedAvgPumps < 5) {
                severity = 'high';
                description = 'You showed extreme caution and banked points very early. This indicates high loss aversion, prioritizing safety over potential higher gains.';
            } else if (adjustedAvgPumps < 8) {
                severity = 'moderate';
                description = 'You showed moderate loss aversion, choosing to secure gains rather than risking explosions most of the time.';
            } else {
                severity = 'low';
                description = 'You exhibit high risk tolerance and low loss aversion! You consistently pumped the balloon for max earnings despite the burst risk.';
            }

            updatedInsight = {
                biasType: 'lossAversion',
                score: lossAversionScore,
                severity,
                description,
                timestamp: new Date().toISOString()
            };

            metrics = {
                adjustedAvgPumps,
                burstCount
            };
        }

        // Output response indicating success and handing the calculated insight back to the frontend.
        return NextResponse.json({ 
            success: true, 
            insight: updatedInsight,
            metrics
        });
    } catch (error) {
        console.error('Error processing assessment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
