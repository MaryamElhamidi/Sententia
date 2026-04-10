// User types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'candidate' | 'manager' | 'admin';
    avatar?: string;
    hasCompletedAssessment: boolean;
    consentGiven: boolean;
    consentDate?: Date;
}

// Cognitive bias types
export type BiasType =
    | 'overconfidence'
    | 'anchoring'
    | 'lossAversion'
    | 'herding'
    | 'confirmation'
    | 'statusQuo';

export interface BiasScore {
    biasType: BiasType;
    score: number; // 0-100
    severity: 'low' | 'moderate' | 'high';
    description: string;
}

export interface CognitiveProfile {
    userId: string;
    overallScore: number;
    biasScores: BiasScore[];
    strengths: string[];
    blindSpots: string[];
    completedDate: Date;
    lastUpdated: Date;
}

// Assessment types
export interface AssessmentTask {
    id: string;
    title: string;
    description: string;
    biasType: BiasType;
    duration: number; // in minutes
    questions: AssessmentQuestion[];
    completed: boolean;
}

export interface AssessmentQuestion {
    id: string;
    type: 'multiple-choice' | 'slider' | 'scenario' | 'confidence';
    question: string;
    options?: string[];
    scenario?: string;
    correctAnswer?: string | number;
}

export interface AssessmentResponse {
    questionId: string;
    answer: string | number;
    confidence?: number; // 0-100
    timeSpent: number; // in seconds
}

export interface AssessmentResult {
    taskId: string;
    userId: string;
    responses: AssessmentResponse[];
    score: number;
    completedAt: Date;
}

// De-biasing activity types
export interface DebiasingActivity {
    id: string;
    title: string;
    description: string;
    targetBias: BiasType;
    type: 'reflection' | 'exercise' | 'reading' | 'practice';
    duration: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    completed: boolean;
    progress?: number; // 0-100
}

// Team types
export interface Team {
    id: string;
    name: string;
    description: string;
    members: string[]; // user IDs
    createdAt: Date;
    updatedAt: Date;
}

// Team Formatting Module Types
export interface IBiasProfile {
    userId: string;
    biasScore: number; // 0-100
    lastAssessmentDate: Date;
}

export interface BiasProfile extends IBiasProfile {
    primaryBias: BiasType;
    riskLevel: 'low' | 'moderate' | 'high';
}

export interface TeamBiasScore {
    teamId: string;
    aggregateMetric: number; // 0-100, average team bias
    highRiskCluster: BiasProfile[];
    synergyMetric: number; // 0-100, team compatibility metric
    lastCalculated: Date;
}

export interface LearningActivity {
    id: string;
    activityId: string;
    title: string;
    description: string;
    targetBias: BiasType;
    type: 'individual' | 'workshop';
    duration: number; // minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    targetUsers?: string[]; // user IDs for individual modules
    completed: boolean;
    progress: number; // 0-100
}

export interface IndividualModule extends LearningActivity {
    reflectionPrompts: string[];
    resources: string[]; // URLs
}

export interface TeamWorkshop extends LearningActivity {
    facilitator?: string;
    groupSize: number;
    objectives: string[];
}

export interface BalancedTeam {
    teamId: string;
    name: string;
    members: BiasProfile[];
    teamBiasScore: TeamBiasScore;
    assignedActivities: LearningActivity[];
    interventionHistory: InterventionRecord[];
}

export interface InterventionRecord {
    id: string;
    teamId: string;
    timestamp: Date;
    strategy: string;
    activitiesAssigned: string[]; // activity IDs
    outcome?: string;
}

export interface TeamAnalytics {
    teamId: string;
    biasDistribution: {
        biasType: BiasType;
        averageScore: number;
        memberCount: number;
    }[];
    cognitiveDiversity: number; // 0-100
    recommendations: string[];
    balanceScore: number; // 0-100
}

// Consent types
export interface ConsentRecord {
    userId: string;
    consentType: 'assessment' | 'data-sharing' | 'team-analytics';
    granted: boolean;
    grantedAt?: Date;
    revokedAt?: Date;
    version: string;
}
