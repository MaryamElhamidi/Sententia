import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/teamFormatting';
import { mockBalancedTeam } from '@/lib/mockData';

/**
 * POST /api/team-formatting/calculate-bias
 * Calculates and returns the team bias score for a given team
 *
 * @param req - Request containing team ID
 * @returns TeamBiasScore object
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { teamId } = body;

        if (!teamId) {
            return NextResponse.json(
                { error: 'Team ID is required' },
                { status: 400 }
            );
        }

        // Mock: Retrieve team from repository
        // In production, this would fetch from a database
        const team = { ...mockBalancedTeam, teamId };

        // Calculate bias score
        const teamBiasScore = await aiEngine.calculateTeamBiasScore(team);

        return NextResponse.json(
            {
                success: true,
                data: teamBiasScore,
                message: 'Team bias score calculated successfully',
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
