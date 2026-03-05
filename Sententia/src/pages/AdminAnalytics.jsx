import React from 'react';
import Card from '../components/ui/Card';
import styles from './Dashboard.module.css'; // Reusing dashboard styles for consistency

const AdminAnalytics = () => {
    return (
        <div className={styles.dashboard}>
            <h1 className={styles.title}>Team Analytics</h1>
            <p className={styles.subtitle}>Aggregated insights for team composition and bias distribution.</p>

            <div className={styles.statsGrid}>
                <Card title="Team Overconfidence" className={styles.statCard}>
                    <div className={styles.statValue}>High</div>
                    <div className={styles.statLabel}>Risk Level</div>
                </Card>
                <Card title="Cognitive Diversity" className={styles.statCard}>
                    <div className={styles.statValue}>Med</div>
                    <div className={styles.statLabel}>Score</div>
                </Card>
            </div>

            <Card title="Bias Distribution Heatmap">
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    Heatmap Visualization Placeholder
                </div>
            </Card>
        </div>
    );
};

export default AdminAnalytics;
