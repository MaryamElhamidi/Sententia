import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/teamFormatting';
import { mockBalancedTeam } from '@/lib/mockData';

/**
 * GET /api/team-formatting/get-interventions/[teamId]
 * Triggers the intervention workflow and returns recommended learning activities
 *
 * @param req - Request object
 * @param params - URL parameters containing teamId
 * @returns Intervention data including activities, strategy, and gaps
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { teamId: string } }
) {
    try {
        const { teamId } = params;

        if (!teamId) {
            return NextResponse.json(
                { error: 'Team ID is required' },
                { status: 400 }
            );
        }

        // Mock: Retrieve team from repository
        // In production, this would fetch from a database
        const team = { ...mockBalancedTeam, teamId };

        // Trigger intervention workflow
        const interventionResult = await aiEngine.triggerIntervention(team);

        return NextResponse.json(
            {
                success: true,
                data: {
                    teamBiasScore: interventionResult.teamBiasScore,
                    gaps: interventionResult.gaps,
                    recommendedActivities: interventionResult.recommendedActivities,
                    interventionPlan: interventionResult.interventionPlan,
                    interventionRecord: interventionResult.interventionRecord,
                },
                message: 'Intervention workflow completed successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
