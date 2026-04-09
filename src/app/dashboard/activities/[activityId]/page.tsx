import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { profileRuntime } from '@/lib/profileEngine';

export default async function ActivityDetailPage({
    params
}: {
    params: Promise<{ activityId: string }>;
}) {
    const { activityId } = await params;
    const activity = await profileRuntime.activityLog.findActivityById(activityId);

    if (!activity) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-cream-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{activity.title}</CardTitle>
                        <CardDescription>
                            {activity.biasType} • {activity.type} • {activity.duration}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-700">{activity.description}</p>
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-1">Why this helps</h3>
                                <p className="text-sm text-gray-700">{activity.whyItHelps}</p>
                            </section>
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-1">How to do it</h3>
                                <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                                    {activity.steps.map((step) => (
                                        <li key={step}>{step}</li>
                                    ))}
                                </ol>
                            </section>
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-1">Reflection prompt</h3>
                                <p className="text-sm italic text-gray-700">{activity.reflectionPrompt}</p>
                            </section>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard/activities">
                        <Button variant="outline">Back to Activity Database</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost">Back to Personal Profile Dashboard</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
