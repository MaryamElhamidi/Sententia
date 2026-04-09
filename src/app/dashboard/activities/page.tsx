import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { profileRuntime } from '@/lib/profileEngine';

export default async function ActivitiesIndexPage() {
    const activities = await profileRuntime.activityLog.listAllActivities();

    return (
        <main className="min-h-screen bg-cream-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Debiasing Activity Database</h1>
                <p className="text-gray-600 mb-8">Database-backed activities from DeBiasingResources.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    {activities.map((activity) => (
                        <Card key={activity.id}>
                            <CardHeader>
                                <CardTitle>{activity.title}</CardTitle>
                                <CardDescription>
                                    {activity.biasType} • {activity.type} • {activity.duration}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                                <Link href={`/dashboard/activities/${activity.id}`}>
                                    <Button variant="outline">Read Full Activity</Button>
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
