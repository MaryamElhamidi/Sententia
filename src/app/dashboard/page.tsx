'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getCurrentSession } from '@/lib/authClient';
import { profileRuntime } from '@/lib/profileEngine';
import { ArrowRight, BookOpenCheck, FileLock2, Scale } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CONSENT_KEY = 'sententia.dashboard.consent.v1';

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
        content: 'Profile data retained for 12 months from last activity. Consent audit logs retained per PIPEDA requirements (minimum 1 year).'
    },
    {
        title: 'Technology used',
        content: 'A supervised ML model categorizes responses into bias profiles. You are not making employment or health decisions based solely on this output.'
    }
];

function toSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [userRole, setUserRole] = useState<'candidate' | 'manager' | 'admin'>('candidate');
    const [userId, setUserId] = useState<string | null>(null);
    const [profile, setProfile] = useState<ReturnType<typeof profileRuntime.controller.onViewProfile>['profile'] | null>(null);
    const [selectedBias, setSelectedBias] = useState('');
    const [activitiesByBias, setActivitiesByBias] = useState<Record<string, Awaited<ReturnType<typeof profileRuntime.activityLog.listAllActivities>>>>({});
    const [hasConsent, setHasConsent] = useState(false);
    const [canAgree, setCanAgree] = useState(false);
    const [showPrivacyPanel, setShowPrivacyPanel] = useState(false);
    const [lastPipedaLog, setLastPipedaLog] = useState<string>('Not logged yet');

    useEffect(() => {
        const load = async () => {
            const session = getCurrentSession();
            if (!session) {
                router.push('/auth/signin');
                return;
            }

            setUserName(session.name || 'User');
            setUserRole(session.role || 'candidate');
            const activeUserId = session.userId;

            setUserId(activeUserId);

            const profileResult = profileRuntime.controller.onViewProfile(activeUserId);
            const profileData = profileResult.profile;
            setProfile(profileData);
            setSelectedBias(profileData.biases[0]?.biasType || '');

            const dbActivities = await profileRuntime.activityLog.listAllActivities();
            const grouped = dbActivities.reduce<Record<string, typeof dbActivities>>((acc, item) => {
                if (!acc[item.biasType]) acc[item.biasType] = [];
                acc[item.biasType].push(item);
                return acc;
            }, {});
            setActivitiesByBias(grouped);

            const consentKey = `${CONSENT_KEY}.${activeUserId}`;
            const localConsent = window.localStorage.getItem(consentKey) === 'true';
            if (localConsent) {
                const updatedConsent = profileRuntime.proxy.handleConsentUpdate(activeUserId, {
                    userId: activeUserId,
                    consentGiven: true,
                    consentDate: new Date().toISOString().slice(0, 10),
                    pipedaLogged: true
                });
                setProfile((prev) => prev ? { ...prev, consentRecord: updatedConsent } : prev);
                setHasConsent(true);
            }

            const latestLog = profileRuntime.logger.getLastLog();
            setLastPipedaLog(latestLog ? new Date(latestLog.timestamp).toLocaleString() : 'Not logged yet');
        };

        load();
    }, [router]);

    const selectedActivities = useMemo(() => {
        if (!selectedBias) return [];
        return (activitiesByBias[selectedBias] || []).slice(0, 3);
    }, [activitiesByBias, selectedBias]);

    const handleConsentScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 8) {
            setCanAgree(true);
        }
    };

    const handleAgreeConsent = () => {
        if (!profile || !userId) return;
        const updatedConsent = profileRuntime.proxy.handleConsentUpdate(userId, {
            userId,
            consentGiven: true,
            consentDate: new Date().toISOString().slice(0, 10),
            pipedaLogged: true
        });

        window.localStorage.setItem(`${CONSENT_KEY}.${userId}`, 'true');
        setProfile({ ...profile, consentRecord: updatedConsent });
        const latestLog = profileRuntime.logger.getLastLog();
        setLastPipedaLog(latestLog ? new Date(latestLog.timestamp).toLocaleString() : 'Not logged yet');
        setHasConsent(true);
    };

    if (!profile) {
        return <div className="min-h-screen grid place-items-center text-gray-600">Loading personal profile dashboard...</div>;
    }

    return (
        <div className="flex min-h-screen bg-cream-50">
            <Sidebar userRole={userRole} />

            <div className="flex-1">
                <Header userName={userName} />

                <main className="p-8 relative">
                    {!hasConsent && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                                <div className="p-5 border-b border-gray-200">
                                    <h2 className="text-2xl font-display font-bold text-gray-900">Zone 1 — Registration & Consent Gate</h2>
                                    <p className="text-sm text-gray-600 mt-1">Scroll through the informed consent language before you can continue.</p>
                                </div>
                                <div className="p-5 overflow-y-auto max-h-[58vh] space-y-4 text-sm text-gray-700" onScroll={handleConsentScroll}>
                                    {consentSections.map((section) => (
                                        <section key={section.title}>
                                            <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                                            <p>{section.content}</p>
                                        </section>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-200 flex items-center justify-between gap-3">
                                    <div className="text-xs text-gray-500 inline-flex items-center gap-2">
                                        <FileLock2 className="w-4 h-4" />
                                        ConsentAuditLog runs in background and is proxy-logged.
                                    </div>
                                    <Button type="button" onClick={handleAgreeConsent} disabled={!canAgree}>
                                        I Agree
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                            Personal Profile Dashboard
                        </h1>
                        <p className="text-lg text-gray-600">
                            Welcome back, {userName}. Your profile is generated from the InsightEngine mock pipeline.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card gradient="teal">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Profile ID</p>
                                        <p className="text-3xl font-bold text-gray-900">#{profile.profileID}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
                                        <BookOpenCheck className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">Generated: {profile.generationDate}</p>
                            </CardContent>
                        </Card>

                        <Card gradient="coral">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Biases Identified</p>
                                        <p className="text-3xl font-bold text-gray-900">{profile.biases.length}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-coral-500 flex items-center justify-center" />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{profile.summary}</p>
                            </CardContent>
                        </Card>

                        <Card gradient="purple">
                            <CardContent className="p-6">
                                <div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">PIPEDA Compliance</p>
                                        <p className="text-lg font-bold text-gray-900 inline-flex items-center gap-2">
                                            <FileLock2 className="w-4 h-4" />
                                            {profile.consentRecord.pipedaLogged ? 'Proxy Logged' : 'Awaiting Consent'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">Last audit event: {lastPipedaLog}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Zone 2 — Personal Profile & Bias Insight View</CardTitle>
                                <CardDescription>
                                    CognitiveProfile summary and formatted bias insights with severity and rationale.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid lg:grid-cols-2 gap-5">
                                    {profile.biases.map((bias) => {
                                        const mappedScore = Math.round(bias.intensityScore * 100);
                                        return (
                                            <article key={bias.biasType} className="rounded-xl border border-gray-200 bg-white p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900">{bias.biasType}</h3>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${bias.severity === 'high' ? 'bg-red-100 text-red-700' : bias.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                        {bias.severity}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{bias.biasDesc}</p>
                                                <ProgressBar value={mappedScore} color={bias.severity === 'high' ? 'coral' : bias.severity === 'moderate' ? 'purple' : 'teal'} />
                                                <p className="text-xs text-gray-500 mt-2">Intensity score: {bias.intensityScore.toFixed(2)}</p>
                                                <p className="text-xs text-gray-600 mt-2">Why this score: {bias.scoreRationale}</p>
                                                <div className="flex items-center gap-2 mt-4">
                                                    <Link href={`/dashboard/insights/${toSlug(bias.biasType)}`}>
                                                        <Button variant="outline" size="sm">View Detailed Insight</Button>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="text-sm text-teal-700 hover:underline"
                                                        onClick={() => {
                                                            setSelectedBias(bias.biasType);
                                                            document.getElementById('zone-3-activities')?.scrollIntoView({ behavior: 'smooth' });
                                                        }}
                                                    >
                                                        View activities
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                                <div className="mt-5 flex items-center gap-3">
                                    <Link href="/dashboard/insights">
                                        <Button variant="primary">
                                            Explore All Insight Pages
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" onClick={() => setShowPrivacyPanel(true)}>
                                        <Scale className="w-4 h-4 mr-2" /> Privacy policy panel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div id="zone-3-activities">
                        <Card>
                            <CardHeader>
                                <CardTitle>Zone 3 — Improvement Activity Log</CardTitle>
                                <CardDescription>
                                    Activities are loaded from the DeBiasingResources database table and grouped by bias type.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {profile.biases.map((bias) => (
                                        <button
                                            key={bias.biasType}
                                            type="button"
                                            className={`px-3 py-2 rounded-lg text-sm border ${selectedBias === bias.biasType ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white text-gray-600 border-gray-200'}`}
                                            onClick={() => setSelectedBias(bias.biasType)}
                                        >
                                            {bias.biasType}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {selectedActivities.map((activity) => (
                                        <article key={activity.id} className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-4">
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                                <span className="text-xs px-2 py-1 rounded-lg bg-purple-200 text-purple-700">{activity.duration}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                            <div className="text-xs text-gray-600 mb-2">Type: <span className="font-semibold capitalize">{activity.type}</span></div>
                                            <p className="text-xs text-gray-700 mb-2"><span className="font-semibold">Why it helps:</span> {activity.whyItHelps}</p>
                                            <ul className="text-xs text-gray-700 list-disc pl-4 mb-3">
                                                {activity.steps.map((step) => (
                                                    <li key={step}>{step}</li>
                                                ))}
                                            </ul>
                                            <p className="text-xs italic text-gray-600">Prompt: {activity.reflectionPrompt}</p>
                                            <div className="mt-3">
                                                <Link href={`/dashboard/activities/${activity.id}`}>
                                                    <Button variant="outline" size="sm">Read Full Activity</Button>
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                <div className="mt-5">
                                    <Link href="/dashboard/activities">
                                        <Button variant="primary">View Full Activity Database</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        </div>
                    </div>

                    {showPrivacyPanel && (
                        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
                            <div className="w-full max-w-xl h-full bg-white shadow-2xl p-6 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-display font-bold text-gray-900">PIPEDA Privacy Policy</h2>
                                    <Button variant="ghost" onClick={() => setShowPrivacyPanel(false)}>Close</Button>
                                </div>
                                <div className="space-y-4 text-sm text-gray-700">
                                    {consentSections.map((section) => (
                                        <section key={`privacy-${section.title}`}>
                                            <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                                            <p>{section.content}</p>
                                        </section>
                                    ))}
                                    <div className="pt-2 text-xs text-gray-600 inline-flex items-center gap-2">
                                        <FileLock2 className="w-4 h-4" />
                                        ConsentAuditLog status: {profile.consentRecord.pipedaLogged ? 'Logged' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
