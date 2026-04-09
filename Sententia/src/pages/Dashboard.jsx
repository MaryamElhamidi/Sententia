import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowRight, CircleCheck, Clock3 } from 'lucide-react';
import { createCognitiveProfileRuntime, mockInsightEnginePayload, strategyRegistry } from '../lib/cognitiveProfileMock';
import styles from './Dashboard.module.css';

const runtime = createCognitiveProfileRuntime(mockInsightEnginePayload);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedBias, setSelectedBias] = useState('');

    useEffect(() => {
        const displayProfile = () => {
            const response = runtime.controller.onViewProfile(mockInsightEnginePayload.userID);
            const profileJSON = response.profile?.toJSONFormat();

            if (!profileJSON) return;

            setDashboardData({
                ...profileJSON,
                consentRecord: response.consentRecord
            });
            setSelectedBias(profileJSON.biases[0]?.biasType || '');
        };

        displayProfile();
    }, []);

    const selectedActivities = useMemo(() => {
        if (!selectedBias) return [];
        return runtime.activityLog.findActivityByBias(selectedBias);
    }, [selectedBias]);

    if (!dashboardData) {
        return <p className={styles.loading}>Loading cognitive profile...</p>;
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeSection}>
                <div>
                    <h1 className={styles.title}>Hello, Yammy!</h1>
                    <p className={styles.subtitle}>{dashboardData.summary}</p>
                </div>
                <Button>Start New Assessment</Button>
            </div>

            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statValue}>{dashboardData.biases.length}</div>
                    <div className={styles.statLabel}>Biases Identified</div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statInline}><Clock3 size={16} /> {dashboardData.generationDate}</div>
                    <div className={styles.statLabel}>Profile Generation Date</div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statInline}><CircleCheck size={16} /> {dashboardData.consentRecord?.consentGiven ? 'Valid' : 'Pending'}</div>
                    <div className={styles.statLabel}>Consent Record</div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statValue}>#{dashboardData.profileID}</div>
                    <div className={styles.statLabel}>Profile ID</div>
                </Card>
            </div>

            <div className={styles.chartSection}>
                <Card title="Cognitive Bias Profile">
                    <div className={styles.biasGrid}>
                        {dashboardData.biases.map((bias) => {
                            const score = strategyRegistry[bias.strategy]?.calculateScore(bias.intensityScore)
                                ?? Math.round(bias.intensityScore * 100);

                            return (
                                <article className={styles.biasCard} key={bias.biasType}>
                                    <div className={styles.biasTop}>
                                        <h4>{bias.biasType}</h4>
                                        <span className={`${styles.severityBadge} ${styles[bias.severity.toLowerCase()]}`}>
                                            {bias.severity}
                                        </span>
                                    </div>
                                    <p className={styles.biasDescription}>{bias.biasDesc}</p>
                                    <div className={styles.intensityRow}>
                                        <span>Intensity</span>
                                        <strong>{score}%</strong>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div className={styles.progressFill} style={{ width: `${score}%` }}></div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </Card>

                <Card title="Improvement Activity Log">
                    <div className={styles.recommendations}>
                        <div className={styles.filterGroup}>
                            {dashboardData.biases.map((bias) => (
                                <button
                                    key={bias.biasType}
                                    className={`${styles.filterChip} ${selectedBias === bias.biasType ? styles.filterChipActive : ''}`}
                                    onClick={() => setSelectedBias(bias.biasType)}
                                >
                                    {bias.biasType}
                                </button>
                            ))}
                        </div>

                        {selectedActivities.map((activity) => (
                            <div className={styles.recItem} key={activity.title}>
                                <div>
                                    <h4>{activity.title}</h4>
                                    <p className={styles.activityDesc}>{activity.description}</p>
                                    <div className={styles.activityMeta}>{activity.type} • {activity.duration}</div>
                                </div>
                            </div>
                        ))}

                        <Button variant="ghost" fullWidth style={{ marginTop: 'auto' }}>
                            View More Activities <ArrowRight size={16} />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
