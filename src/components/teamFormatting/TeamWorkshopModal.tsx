'use client';

import React, { useState } from 'react';
import { LearningActivity, TeamWorkshop } from '@/lib/types';
import styles from './TeamWorkshopModal.module.css';

interface TeamWorkshopModalProps {
    activity: LearningActivity;
    onClose: () => void;
}

/**
 * TeamWorkshopModal Component
 * Displays detailed workshop information and allows team participation
 */
export default function TeamWorkshopModal({
    activity,
    onClose,
}: TeamWorkshopModalProps) {
    const [isStarting, setIsStarting] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const handleStartWorkshop = async () => {
        setIsStarting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setHasStarted(true);
        setIsStarting(false);
    };

    const handleComplete = () => {
        onClose();
    };

    const workshop = activity as unknown as TeamWorkshop;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>

                {!hasStarted ? (
                    <>
                        {/* Header */}
                        <div className={styles.header}>
                            <span className={styles.badge}>Workshop</span>
                            <h2>{activity.title}</h2>
                            <p className={styles.biasTarget}>
                                Target Bias: <strong>{activity.targetBias}</strong>
                            </p>
                        </div>

                        {/* Content */}
                        <div className={styles.content}>
                            <section className={styles.section}>
                                <h3>Overview</h3>
                                <p>{activity.description}</p>
                            </section>

                            {workshop.facilitator && (
                                <section className={styles.section}>
                                    <h3>Facilitator</h3>
                                    <p>{workshop.facilitator}</p>
                                </section>
                            )}

                            <section className={styles.section}>
                                <h3>Workshop Details</h3>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>
                                            Duration
                                        </span>
                                        <span className={styles.detailValue}>
                                            {activity.duration} minutes
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>
                                            Difficulty
                                        </span>
                                        <span className={styles.detailValue}>
                                            {activity.difficulty}
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>
                                            Group Size
                                        </span>
                                        <span className={styles.detailValue}>
                                            {workshop.groupSize} participants
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {workshop.objectives &&
                                workshop.objectives.length > 0 && (
                                    <section className={styles.section}>
                                        <h3>Learning Objectives</h3>
                                        <ul className={styles.objectivesList}>
                                            {workshop.objectives.map(
                                                (objective, idx) => (
                                                    <li key={idx}>
                                                        <span className={styles.checkmark}>
                                                            ✓
                                                        </span>
                                                        {objective}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </section>
                                )}

                            {activity.targetUsers &&
                                activity.targetUsers.length > 0 && (
                                    <section className={styles.section}>
                                        <h3>Participants</h3>
                                        <p className={styles.participantInfo}>
                                            {activity.targetUsers.length} team members
                                            registered for this workshop
                                        </p>
                                        <div className={styles.participantList}>
                                            {activity.targetUsers.map((userId) => (
                                                <span
                                                    key={userId}
                                                    className={styles.participantBadge}
                                                >
                                                    Team Member {userId}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}
                        </div>

                        {/* Footer */}
                        <div className={styles.footer}>
                            <button
                                className={styles.cancelButton}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.startButton}
                                onClick={handleStartWorkshop}
                                disabled={isStarting}
                            >
                                {isStarting ? 'Starting...' : 'Start Workshop'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Workshop Active State */}
                        <div className={styles.activeContent}>
                            <div className={styles.successIcon}>✓</div>
                            <h2>Workshop in Progress</h2>
                            <p className={styles.activeMessage}>
                                {activity.title} has started successfully
                            </p>

                            <div className={styles.workshopStatus}>
                                <div className={styles.statusItem}>
                                    <h4>Current Activity</h4>
                                    <p>{activity.description}</p>
                                </div>

                                <div className={styles.statusItem}>
                                    <h4>Your Role</h4>
                                    <p>Active Participant</p>
                                </div>

                                <div className={styles.statusItem}>
                                    <h4>Progress</h4>
                                    <div className={styles.miniProgressBar}>
                                        <div className={styles.miniProgressFill} />
                                    </div>
                                    <p className={styles.progressText}>
                                        0% complete
                                    </p>
                                </div>
                            </div>

                            <div className={styles.footer}>
                                <button
                                    className={styles.completeButton}
                                    onClick={handleComplete}
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
