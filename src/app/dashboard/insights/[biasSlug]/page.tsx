import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { profileRuntime } from '@/lib/profileEngine';

function toSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function InsightDetailPage({
    params
}: {
    params: Promise<{ biasSlug: string }>;
}) {
    const { biasSlug } = await params;
    const profile = profileRuntime.repository.fetchProfileByUserId('preview-user');
    const bias = profile.biases.find((item) => toSlug(item.biasType) === biasSlug);

    if (!bias) {
        notFound();
    }

    const scorePercent = Math.round(bias.intensityScore * 100);

    return (
        <main className="min-h-screen bg-cream-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{bias.biasType}</CardTitle>
                        <CardDescription>
                            Score {bias.intensityScore.toFixed(2)} ({scorePercent}%) • Severity {bias.severity}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-1">What this means</h3>
                                <p className="text-sm text-gray-700">{bias.biasDesc}</p>
                            </section>
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-1">Why this score</h3>
                                <p className="text-sm text-gray-700">{bias.scoreRationale}</p>
                            </section>
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-1">How to improve</h3>
                                <p className="text-sm text-gray-700">
                                    Use the tailored activities in the Improvement Activity Log to deliberately practice de-biasing under realistic decision conditions.
                                </p>
                            </section>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard#zone-3-activities">
                        <Button variant="primary">Go to Related Activities</Button>
                    </Link>
                    <Link href="/dashboard/insights">
                        <Button variant="outline">Back to All Insights</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
