import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/teamFormatting';
import { mockBalancedTeam } from '@/lib/mockData';

/**
 * GET /api/team-formatting/recommendations/[teamId]
 * Returns recommendations for a team based on current analysis
 *
 * @param req - Request object
 * @param params - URL parameters containing teamId
 * @returns Array of recommendation strings
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
        const team = { ...mockBalancedTeam, teamId };

        // Get recommendations
        const recommendations = await aiEngine.getRecommendations(team);

        return NextResponse.json(
            {
                success: true,
                data: {
                    teamId,
                    recommendations,
                },
                message: 'Recommendations retrieved successfully',
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
