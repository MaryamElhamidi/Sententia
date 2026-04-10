import { BalancedTeam, LearningActivity, BiasType } from '../types';
import {
    mockLearningActivities,
    mockIndividualModules,
    mockTeamWorkshops,
} from '../mockData';

/**
 * ActivityMapper: Maps team biases to appropriate de-biasing activities
 * Handles activity selection and mitigation strategy formulation
 */
export class ActivityMapper {
    /**
     * Maps a specific bias to recommended learning activities
     * Returns hardcoded mock activities for demonstration
     */
    mapActivityToBias(biasType: BiasType, targetUsers?: string[]): LearningActivity[] {
        // Hardcoded activity mappings
        const activityMappings: Record<BiasType, LearningActivity[]> = {
            overconfidence: [
                mockLearningActivities[0], // Pre-Mortem Analysis Workshop
            ],
            anchoring: [
                mockLearningActivities[1], // Consider the Opposite - Individual
            ],
            lossAversion: [
                mockLearningActivities[3], // Risk & Reward Assessment
            ],
            herding: [
                mockLearningActivities[2], // Structured Decision-Making Framework
            ],
            confirmation: [
                mockLearningActivities[1], // Consider the Opposite as fallback
            ],
            statusQuo: [
                mockLearningActivities[2], // Team framework as fallback
            ],
        };

        return activityMappings[biasType] || [];
    }

    /**
     * Generates a mitigation strategy based on team composition and bias profile
     * Returns hardcoded strategies for demonstration
     */
    getMitigationStrategy(team: BalancedTeam): string {
        const highRiskCount = team.teamBiasScore.highRiskCluster.length;
        const synergyScore = team.teamBiasScore.synergyMetric;

        // Hardcoded strategy logic
        if (highRiskCount >= 3) {
            return `CRITICAL: Team has ${highRiskCount} high-risk members. Recommend immediate structured decision-making workshops and individual de-biasing modules. Focus on cognitive diversity by pairing complementary thinkers.`;
        }

        if (synergyScore < 60) {
            return `MODERATE: Team synergy is below optimal (${synergyScore}%). Recommend team-based de-biasing workshops to improve collaboration and shared mental models.`;
        }

        return `GOOD: Team is well-balanced (synergy ${synergyScore}%). Recommend maintenance activities focusing on the highest-risk individual biases.`;
    }

    /**
     * Generates a comprehensive intervention plan for a team
     */
    generateInterventionPlan(team: BalancedTeam): {
        strategy: string;
        activities: LearningActivity[];
        timeline: string;
        priority: 'low' | 'medium' | 'high';
    } {
        const strategy = this.getMitigationStrategy(team);
        const activities: LearningActivity[] = [];

        // Collect activities for each high-risk member
        team.teamBiasScore.highRiskCluster.forEach((profile) => {
            const biasActivities = this.mapActivityToBias(
                profile.primaryBias,
                [profile.userId]
            );
            activities.push(...biasActivities);
        });

        // Determine priority based on aggregate bias score
        let priority: 'low' | 'medium' | 'high' = 'low';
        if (team.teamBiasScore.aggregateMetric > 70) {
            priority = 'high';
        } else if (team.teamBiasScore.aggregateMetric > 50) {
            priority = 'medium';
        }

        return {
            strategy,
            activities: activities.length > 0 ? activities : mockLearningActivities,
            timeline:
                priority === 'high'
                    ? '2 weeks'
                    : priority === 'medium'
                      ? '4 weeks'
                      : '8 weeks',
            priority,
        };
    }
}
