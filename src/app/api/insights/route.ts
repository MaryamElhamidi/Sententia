import { NextResponse } from 'next/server';
import { mockCognitiveProfile } from '@/lib/mockData';

/**
 * GET /api/insights
 * 
 * Provides cognitive profile retrieval functionality. Represents the interaction 
 * between the DataCollectionService collecting previously generated Behavioural Insights 
 * from the database layer and exposing it to the UI (`ResultsView`).
 */
export async function GET() {
    // In a real application, we would decode the authenticated user's session token
    // and use their ID to fetch their specific CognitiveProfile and associated BiasInsights
    // mapping to the `CognitiveProfile -> BiasInsight` composition architecture.
    
    // Artificial 800ms delay to realistically simulate the overhead 
    // of a Remote Database network fetch.
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return the deeply nested profile structure to the client UI.
    return NextResponse.json(mockCognitiveProfile);
}
