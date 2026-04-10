'use client';

import React, { useState, useEffect } from 'react';
import { TeamBiasScore, LearningActivity } from '@/lib/types';
import { mockBalancedTeam, mockLearningActivities } from '@/lib/mockData';
import TeamWorkshopModal from './TeamWorkshopModal';
import styles from './TeamDashboard.module.css';

/**
 * TeamDashboard Component
 * Displays team bias metrics, learning activities, and intervention options
 */
export default function TeamDashboard() {
    const [teamBiasScore, setTeamBiasScore] = useState<TeamBiasScore>(
        mockBalancedTeam.teamBiasScore
    );
    const [activities, setActivities] = useState<LearningActivity[]>(
        mockLearningActivities
    );
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [showWorkshopModal, setShowWorkshopModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
        null
    );

    // Fetch bias score and interventions
    useEffect(() => {
        fetchInterventions();
    }, []);

    const fetchInterventions = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/team-formatting/get-interventions/${mockBalancedTeam.teamId}`,
                { method: 'GET' }
            );

            const result = await response.json();
            if (result.success) {
                setTeamBiasScore(result.data.teamBiasScore);
                setActivities(result.data.recommendedActivities);
                setRecommendations(result.data.gaps);
            }
        } catch (error) {
            console.error('Error fetching interventions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMetricColor = (score: number): string => {
        if (score > 70) return '#ef4444'; // red
        if (score > 50) return '#f97316'; // orange
        return '#22c55e'; // green
    };

    const handleStartWorkshop = (activityId: string) => {
        setSelectedActivityId(activityId);
        setShowWorkshopModal(true);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1>Team Dashboard</h1>
                    <p className={styles.subtitle}>
                        {mockBalancedTeam.name} - Cognitive Bias Analysis
                    </p>
                </div>

                {/* Key Metrics Section */}
                <div className={styles.metricsGrid}>
                    {/* Aggregate Metric Card */}
                    <div className={styles.metricCard}>
                        <div className={styles.metricTitle}>
                            Team Aggregate Bias
                        </div>
                        <div className={styles.metricValue}>
                            {teamBiasScore.aggregateMetric}
                            <span className={styles.metricUnit}>/100</span>
                        </div>
                        <div
                            className={styles.metricBar}
                            style={{
                                width: `${teamBiasScore.aggregateMetric}%`,
                                backgroundColor: getMetricColor(
                                    teamBiasScore.aggregateMetric
                                ),
                            }}
                        />
                        <div className={styles.metricDescription}>
                            {teamBiasScore.aggregateMetric > 70
                                ? 'High bias - implement interventions'
                                : teamBiasScore.aggregateMetric > 50
                                  ? 'Moderate bias - monitor closely'
                                  : 'Low bias - maintain current practices'}
                        </div>
                    </div>

                    {/* Synergy Metric Card */}
                    <div className={styles.metricCard}>
                        <div className={styles.metricTitle}>Team Synergy</div>
                        <div className={styles.metricValue}>
                            {teamBiasScore.synergyMetric}
                            <span className={styles.metricUnit}>/100</span>
                        </div>
                        <div
                            className={styles.metricBar}
                            style={{
                                width: `${teamBiasScore.synergyMetric}%`,
                                backgroundColor: `rgba(34, 197, 94, ${teamBiasScore.synergyMetric / 100})`,
                            }}
                        />
                        <div className={styles.metricDescription}>
                            Team compatibility and cognitive diversity
                        </div>
                    </div>

                    {/* High Risk Members Card */}
                    <div className={styles.metricCard}>
                        <div className={styles.metricTitle}>
                            High-Risk Members
                        </div>
                        <div className={styles.metricValue}>
                            {teamBiasScore.highRiskCluster.length}
                        </div>
                        <div className={styles.riskList}>
                            {teamBiasScore.highRiskCluster.map((profile) => (
                                <div key={profile.userId} className={styles.riskItem}>
                                    <span className={styles.riskLabel}>
                                        {profile.primaryBias}
                                    </span>
                                    <span className={styles.riskScore}>
                                        {profile.biasScore}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                    <div className={styles.recommendationsSection}>
                        <h2>Recommendations</h2>
                        <div className={styles.recommendationsList}>
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className={styles.recommendationItem}>
                                    <span className={styles.recommendationIcon}>→</span>
                                    {rec}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Activities Section */}
                <div className={styles.activitiesSection}>
                    <h2>Assigned Learning Activities</h2>

                    {loading ? (
                        <div className={styles.loading}>Loading activities...</div>
                    ) : activities.length > 0 ? (
                        <div className={styles.activitiesGrid}>
                            {activities.map((activity) => (
                                <div key={activity.id} className={styles.activityCard}>
                                    <div className={styles.activityHeader}>
                                        <h3>{activity.title}</h3>
                                        <span
                                            className={`${styles.activityType} ${styles[activity.type]}`}
                                        >
                                            {activity.type === 'workshop'
                                                ? '↔ Workshop'
                                                : '⚙ Individual'}
                                        </span>
                                    </div>

                                    <p className={styles.activityDescription}>
                                        {activity.description}
                                    </p>

                                    <div className={styles.activityMeta}>
                                        <span>
                                            <strong>Bias:</strong> {activity.targetBias}
                                        </span>
                                        <span>
                                            <strong>Duration:</strong> {activity.duration} min
                                        </span>
                                        <span>
                                            <strong>Difficulty:</strong> {activity.difficulty}
                                        </span>
                                    </div>

                                    <div className={styles.progressSection}>
                                        <div className={styles.progressLabel}>
                                            Progress: {activity.progress}%
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${activity.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {activity.type === 'workshop' ? (
                                        <button
                                            className={styles.workshopButton}
                                            onClick={() => handleStartWorkshop(activity.id)}
                                        >
                                            Start Workshop
                                        </button>
                                    ) : (
                                        <button className={styles.startButton}>
                                            Begin Activity
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noActivities}>
                            No activities assigned yet.
                        </div>
                    )}
                </div>

                {/* Refresh Button */}
                <div className={styles.actionBar}>
                    <button
                        className={styles.refreshButton}
                        onClick={fetchInterventions}
                        disabled={loading}
                    >
                        {loading ? 'Analyzing...' : 'Refresh Analysis'}
                    </button>
                </div>
            </div>

            {/* Workshop Modal */}
            {showWorkshopModal && selectedActivityId && (
                <TeamWorkshopModal
                    activity={
                        activities.find((a) => a.id === selectedActivityId) ||
                        activities[0]
                    }
                    onClose={() => {
                        setShowWorkshopModal(false);
                        setSelectedActivityId(null);
                    }}
                />
            )}
        </div>
    );
}
