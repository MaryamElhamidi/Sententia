import React, { useEffect, useMemo, useRef, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowRight, BookOpenCheck, CircleCheck, Clock3, FileLock2, Scale } from 'lucide-react';
import { createCognitiveProfileRuntime, mockInsightEnginePayload, strategyRegistry } from '../lib/cognitiveProfileMock';
import { authGateway, integrationFlags, registrationGateway } from '../lib/identityProviders';
import styles from './Dashboard.module.css';

const runtime = createCognitiveProfileRuntime(mockInsightEnginePayload);
const CONSENT_STORAGE_KEY = 'sententia.pipeda.consent.v1';

const consentSections = [
    {
        title: 'Purpose',
        content: 'This application collects cognitive task responses to identify potential cognitive biases. Data is processed by a machine learning model that categorizes patterns into bias profiles (e.g., anchoring, overconfidence). The goal is to support personal development, not clinical diagnosis.'
    },
    {
        title: 'What is collected',
        content: 'Task response times, answer patterns, and self-reported reflections. No medical data, no employment data.'
    },
    {
        title: 'How it is used',
        content: 'Data trains and runs the bias classification model. Your profile is shown only to you. No data is sold or shared with third parties.'
    },
    {
        title: 'Your rights under PIPEDA',
        content: 'You may withdraw consent at any time. Withdrawing removes your data from future processing but audit logs are retained per legal obligation. You may request a copy of your data or its deletion.'
    },
    {
        title: 'Employment status',
        content: 'Participation does not affect your employment in any way.'
    },
    {
        title: 'Risks',
        content: 'Bias labels are probabilistic, not definitive. Misidentification is possible. This is not a clinical or diagnostic tool.'
    },
    {
        title: 'Benefits',
        content: 'You gain a personalized view of cognitive tendencies and access to targeted improvement activities.'
    },
    {
        title: 'Data retention',
        content: 'Profile data is retained for 12 months from last activity. Consent audit logs are retained per PIPEDA requirements (minimum 1 year).'
    },
    {
        title: 'Technology used',
        content: 'A supervised ML model categorizes responses into bias profiles. You are not making employment or health decisions based solely on this output.'
    }
];

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedBias, setSelectedBias] = useState('');
    const [hasConsent, setHasConsent] = useState(false);
    const [canAgree, setCanAgree] = useState(false);
    const [showPrivacyPanel, setShowPrivacyPanel] = useState(false);
    const [lastAccessLog, setLastAccessLog] = useState(null);
    const [identityContext, setIdentityContext] = useState({
        user: null,
        authProvider: 'mock',
        isAuthenticated: true,
        registrationProvider: 'mock',
        registrationStatus: 'registered'
    });
    const consentStorageKeyRef = useRef(CONSENT_STORAGE_KEY);

    useEffect(() => {
        const displayProfile = async () => {
            const authState = await authGateway.getSessionUser();
            const activeUser = authState.user ?? {
                id: String(mockInsightEnginePayload.userID),
                displayName: 'Yammy A.',
                email: 'yammy@example.com'
            };
            const registrationRecord = await registrationGateway.getRegistrationRecord(activeUser);
            const localUserId = activeUser.id || String(mockInsightEnginePayload.userID);
            const userScopedConsentKey = `${CONSENT_STORAGE_KEY}.${localUserId}`;
            consentStorageKeyRef.current = userScopedConsentKey;

            const localConsent = localStorage.getItem(userScopedConsentKey);
            const hasLocalConsent = localConsent === 'true';

            const response = runtime.controller.onViewProfile(localUserId);
            const profileJSON = response.profile?.toJSONFormat();

            if (!profileJSON) return;

            setDashboardData({
                ...profileJSON,
                consentRecord: response.consentRecord,
                registrationRecord,
                authState
            });
            setIdentityContext({
                user: activeUser,
                authProvider: authState.provider,
                isAuthenticated: authState.isAuthenticated,
                registrationProvider: registrationRecord.provider,
                registrationStatus: registrationRecord.status
            });
            setSelectedBias(profileJSON.biases[0]?.biasType || '');
            setLastAccessLog(runtime.logger.getLastLog());

            if (hasLocalConsent && response.hasValidConsent) {
                setHasConsent(true);
            }
        };

        displayProfile();
    }, []);

    const selectedActivities = useMemo(() => {
        if (!selectedBias) return [];
        return runtime.activityLog.findActivityByBias(selectedBias);
    }, [selectedBias]);

    const handleConsentScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 8) {
            setCanAgree(true);
        }
    };

    const handleAgreeConsent = () => {
        const activeUserId = dashboardData?.userID || mockInsightEnginePayload.userID;
        const updatedConsentRecord = runtime.proxy.handleConsentUpdate(activeUserId, {
            userId: activeUserId,
            consentGiven: true,
            consentDate: new Date().toISOString().slice(0, 10),
            pipedaLogged: true
        });

        localStorage.setItem(consentStorageKeyRef.current, 'true');
        setDashboardData((prev) => ({
            ...prev,
            consentRecord: updatedConsentRecord
        }));
        setLastAccessLog(runtime.logger.getLastLog());
        setHasConsent(true);
    };

    if (!dashboardData) {
        return <p className={styles.loading}>Loading cognitive profile...</p>;
    }

    return (
        <div className={styles.dashboardWrapper}>
            {!hasConsent && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <div className={styles.modalHeader}>
                            <h2>Digital Health Technology Informed Consent</h2>
                            <p>Review the terms below. Scroll to the end to enable agreement.</p>
                        </div>
                        <div className={styles.modalBody} onScroll={handleConsentScroll}>
                            {consentSections.map((section) => (
                                <section key={section.title} className={styles.policySection}>
                                    <h3>{section.title}</h3>
                                    <p>{section.content}</p>
                                </section>
                            ))}
                        </div>
                        <div className={styles.modalFooter}>
                            <span className={styles.modalHint}>
                                <FileLock2 size={16} /> PIPEDA-compliant access logging is enabled.
                            </span>
                            <div className={styles.modalActions}>
                                {integrationFlags.hasAuth0Config && !identityContext.isAuthenticated && (
                                    <Button variant="secondary" onClick={() => authGateway.login()}>
                                        Sign in with Auth0
                                    </Button>
                                )}
                                <Button onClick={handleAgreeConsent} disabled={!canAgree}>
                                    I Agree and Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.dashboard} aria-hidden={!hasConsent}>
                <div className={styles.welcomeSection}>
                    <div>
                        <h1 className={styles.title}>Hello, {identityContext.user?.displayName || 'User'}!</h1>
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

                    <Card className={styles.statCard}>
                        <div className={styles.statInline}>{identityContext.authProvider === 'auth0' ? 'Auth0' : 'Mock'}</div>
                        <div className={styles.statLabel}>Authentication Source</div>
                    </Card>

                    <Card className={styles.statCard}>
                        <div className={styles.statInline}>{identityContext.registrationProvider === 'supabase' ? `Supabase (${identityContext.registrationStatus})` : 'Mock'}</div>
                        <div className={styles.statLabel}>Registration Source</div>
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

                <Card title="Privacy Policy (PIPEDA)">
                    <div className={styles.privacyPanel}>
                        <p>
                            Your data is used only for personal insight generation. No sharing, selling, or external profiling occurs.
                            Consent can be withdrawn at any time.
                        </p>
                        <Button variant="secondary" onClick={() => setShowPrivacyPanel((prev) => !prev)}>
                            <Scale size={16} /> {showPrivacyPanel ? 'Hide Full Policy' : 'View Full Policy'}
                        </Button>
                        {showPrivacyPanel && (
                            <div className={styles.policyExpanded}>
                                {consentSections.map((section) => (
                                    <section key={`policy-${section.title}`} className={styles.policySectionCompact}>
                                        <h4>{section.title}</h4>
                                        <p>{section.content}</p>
                                    </section>
                                ))}
                            </div>
                        )}
                        <div className={styles.privacyFootnote}>
                            <BookOpenCheck size={14} /> Consent date: {dashboardData.consentRecord?.consentDate || 'Not yet provided'}
                        </div>
                        <div className={styles.integrationFootnote}>
                            Auth provider: {integrationFlags.hasAuth0Config ? 'Auth0 configured' : 'Auth0 env missing (mock fallback active)'}
                        </div>
                        <div className={styles.integrationFootnote}>
                            Registration provider: {integrationFlags.hasSupabaseConfig ? 'Supabase configured' : 'Supabase env missing (mock fallback active)'}
                        </div>
                        <div className={styles.integrationFootnote}>
                            Last access log: {lastAccessLog ? new Date(lastAccessLog.timestamp).toLocaleString() : 'Not logged yet'}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
