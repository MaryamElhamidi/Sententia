import {
    BalancedTeam,
    TeamBiasScore,
    LearningActivity,
    InterventionRecord,
} from '../types';
import { ActivityMapper } from './ActivityMapper';
import { mockBalancedTeam, mockLearningActivities } from '../mockData';

/**
 * AIEngine: Orchestrates team analysis and intervention logic
 * Uses hardcoded values instead of actual ML/AI components
 */
export class AIEngine {
    private activityMapper: ActivityMapper;

    constructor() {
        this.activityMapper = new ActivityMapper();
    }

    /**
     * Calculates team bias score using hardcoded aggregation logic
     */
    async calculateTeamBiasScore(
        team: BalancedTeam
    ): Promise<TeamBiasScore> {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Hardcoded calculation
        const biasScores = team.members.map((m) => m.biasScore);
        const aggregateMetric =
            biasScores.reduce((a, b) => a + b, 0) / biasScores.length;

        // Identify high-risk members (score > 60)
        const highRiskCluster = team.members.filter((m) => m.biasScore > 60);

        // Hardcoded synergy metric based on diversity
        const synergyMetric = this.calculateSynergyMetric(team);

        return {
            teamId: team.teamId,
            aggregateMetric: Math.round(aggregateMetric),
            highRiskCluster,
            synergyMetric,
            lastCalculated: new Date(),
        };
    }

    /**
     * Calculates team synergy based on bias diversity
     * Returns hardcoded synergy score (0-100)
     */
    private calculateSynergyMetric(team: BalancedTeam): number {
        // Hardcoded synergy calculation based on bias type distribution
        const biasTypes = team.members.map((m) => m.primaryBias);
        const uniqueBiases = new Set(biasTypes).size;

        // More diversity = higher synergy
        const diversityBonus = (uniqueBiases / team.members.length) * 40;

        // Lower aggregate bias = higher synergy
        const avgBias =
            team.members.reduce((sum, m) => sum + m.biasScore, 0) /
            team.members.length;
        const scoreBonus = Math.max(0, 100 - avgBias);

        return Math.min(100, Math.round(diversityBonus + (scoreBonus * 0.6)));
    }

    /**
     * Identifies gaps in team performance based on bias profiles
     */
    async identifyGaps(team: BalancedTeam): Promise<string[]> {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 300));

        const gaps: string[] = [];

        // Hardcoded gap identification
        const highRiskCount = team.teamBiasScore.highRiskCluster.length;
        if (highRiskCount > 2) {
            gaps.push(
                'Critical: Multiple high-risk bias profiles detected. Recommend immediate intervention.'
            );
        }

        if (team.teamBiasScore.synergyMetric < 60) {
            gaps.push(
                'Moderate: Team synergy below optimal. Consider diversity-focused team building.'
            );
        }

        if (team.teamBiasScore.aggregateMetric > 70) {
            gaps.push(
                'High: Average team bias score elevated. Prioritize de-biasing training.'
            );
        }

        // Check for dominant bias type
        const biasTypeCounts = new Map<string, number>();
        team.members.forEach((m) => {
            biasTypeCounts.set(
                m.primaryBias,
                (biasTypeCounts.get(m.primaryBias) || 0) + 1
            );
        });

        for (const [biasType, count] of biasTypeCounts) {
            if (count > team.members.length / 2) {
                gaps.push(
                    `Risk: Team is dominated by ${biasType} bias. Seek diverse perspectives.`
                );
            }
        }

        return gaps.length > 0
            ? gaps
            : [
                  'Team is performing well. Continue monitoring and maintain current de-biasing practices.',
              ];
    }

    /**
     * Triggers a full intervention workflow
     * Orchestrates the flow: score calc → gap analysis → activity mapping → recommendation
     */
    async triggerIntervention(
        team: BalancedTeam
    ): Promise<{
        teamBiasScore: TeamBiasScore;
        gaps: string[];
        recommendedActivities: LearningActivity[];
        interventionPlan: ReturnType<ActivityMapper['generateInterventionPlan']>;
        interventionRecord: InterventionRecord;
    }> {
        // Step 1: Calculate team bias score
        const teamBiasScore = await this.calculateTeamBiasScore(team);
        team.teamBiasScore = teamBiasScore;

        // Step 2: Identify gaps
        const gaps = await this.identifyGaps(team);

        // Step 3: Generate intervention plan
        const interventionPlan =
            this.activityMapper.generateInterventionPlan(team);

        // Step 4: Get recommended activities
        const recommendedActivities =
            interventionPlan.activities.length > 0
                ? interventionPlan.activities
                : mockLearningActivities;

        // Step 5: Create intervention record
        const interventionRecord: InterventionRecord = {
            id: `int-${Date.now()}`,
            teamId: team.teamId,
            timestamp: new Date(),
            strategy: interventionPlan.strategy,
            activitiesAssigned: recommendedActivities.map((a) => a.id),
        };

        return {
            teamBiasScore,
            gaps,
            recommendedActivities,
            interventionPlan,
            interventionRecord,
        };
    }

    /**
     * Simulates progress tracking for an assigned activity
     */
    async updateActivityProgress(
        activityId: string,
        progress: number
    ): Promise<LearningActivity | null> {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 200));

        const activity = mockLearningActivities.find(
            (a) => a.id === activityId
        );
        if (activity) {
            activity.progress = Math.min(100, Math.max(0, progress));
            activity.completed = progress >= 100;
            return activity;
        }

        return null;
    }

    /**
     * Gets recommendations for a team based on current state
     */
    async getRecommendations(team: BalancedTeam): Promise<string[]> {
        const gaps = await this.identifyGaps(team);
        const plan = this.activityMapper.generateInterventionPlan(team);

        return [
            plan.strategy,
            ...gaps,
            `Priority Level: ${plan.priority.toUpperCase()}`,
            `Recommended Timeline: ${plan.timeline}`,
        ];
    }
}

// Singleton instance for use across the app
export const aiEngine = new AIEngine();
