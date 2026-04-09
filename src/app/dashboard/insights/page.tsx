import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { profileRuntime } from '@/lib/profileEngine';

function toSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function InsightsIndexPage() {
    const profile = profileRuntime.repository.fetchProfileByUserId('preview-user');

    return (
        <main className="min-h-screen bg-cream-50 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Detailed Bias Insights</h1>
                <p className="text-gray-600 mb-8">Each bias card opens a dedicated explanation page showing rationale and scoring context.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    {profile.biases.map((bias) => (
                        <Card key={bias.biasType}>
                            <CardHeader>
                                <CardTitle>{bias.biasType}</CardTitle>
                                <CardDescription>Intensity {bias.intensityScore.toFixed(2)} • Severity {bias.severity}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 mb-4">{bias.biasDesc}</p>
                                <Link href={`/dashboard/insights/${toSlug(bias.biasType)}`}>
                                    <Button variant="outline">Open Insight Page</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8">
                    <Link href="/dashboard">
                        <Button variant="ghost">Back to Personal Profile Dashboard</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
