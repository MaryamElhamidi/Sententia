import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TrendingUp, Target, Brain, ArrowRight } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeSection}>
                <div>
                    <h1 className={styles.title}>Hello, Yammy!</h1>
                    <p className={styles.subtitle}>Here is your cognitive bias overview for this week.</p>
                </div>
                <Button>Start New Assessment</Button>
            </div>

            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statValue}>85%</div>
                    <div className={styles.statLabel}>Decision Quality</div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statValue}>3</div>
                    <div className={styles.statLabel}>Pending Tasks</div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statValue}>12</div>
                    <div className={styles.statLabel}>Biases Identified</div>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statValue}>4.8/5</div>
                    <div className={styles.statLabel}>Team Fit Score</div>
                </Card>
            </div>

            <div className={styles.chartSection}>
                <Card title="Cognitive Profile Trends">
                    <div className={styles.chartPlaceholder}>
                        {/* Simulated bars */}
                        <div className={styles.bar} style={{ height: '40%' }}></div>
                        <div className={styles.bar} style={{ height: '60%' }}></div>
                        <div className={styles.bar} style={{ height: '55%' }}></div>
                        <div className={styles.bar} style={{ height: '75%' }}></div>
                        <div className={styles.bar} style={{ height: '45%' }}></div>
                        <div className={styles.bar} style={{ height: '80%' }}></div>
                        <div className={styles.bar} style={{ height: '65%' }}></div>
                    </div>
                </Card>

                <Card title="Recommended Actions">
                    <div className={styles.recommendations}>
                        <div className={styles.recItem}>
                            <div className={styles.recIcon}><TrendingUp size={18} /></div>
                            <div>
                                <h4>Reduce Overconfidence</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    Take the "Calibration Game" to test your certainty.
                                </p>
                            </div>
                        </div>

                        <div className={styles.recItem}>
                            <div className={styles.recIcon}><Target size={18} /></div>
                            <div>
                                <h4>Anchoring Awareness</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    Review the pricing negotiation module.
                                </p>
                            </div>
                        </div>

                        <div className={styles.recItem}>
                            <div className={styles.recIcon}><Brain size={18} /></div>
                            <div>
                                <h4>Reflective Journal</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    Log your recent team decision process.
                                </p>
                            </div>
                        </div>

                        <Button variant="ghost" fullWidth style={{ marginTop: 'auto' }}>
                            View All <ArrowRight size={16} />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
