import React from 'react';
import AssessmentRoadmap from '../components/assessment/AssessmentRoadmap';

const AssessmentCenter = () => {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Assessment Journey</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                Follow your personalized path to master cognitive bias awareness.
            </p>

            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'radial-gradient(circle at 50% 50%, #f9fafb 0%, #f3f4f6 100%)'
            }}>
                <AssessmentRoadmap />
            </div>
        </div>
    );
};

export default AssessmentCenter;
