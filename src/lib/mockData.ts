import {
    User,
    CognitiveProfile,
    AssessmentTask,
    DebiasingActivity,
    Team,
    TeamAnalytics,
    BiasType,
    BiasProfile,
    TeamBiasScore,
    LearningActivity,
    BalancedTeam,
    IndividualModule,
    TeamWorkshop,
} from './types';

// Mock users
export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'candidate',
        hasCompletedAssessment: true,
        consentGiven: true,
        consentDate: new Date('2024-01-15'),
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        role: 'manager',
        hasCompletedAssessment: true,
        consentGiven: true,
        consentDate: new Date('2024-01-10'),
    },
    {
        id: '3',
        name: 'Emma Williams',
        email: 'emma@example.com',
        role: 'admin',
        hasCompletedAssessment: true,
        consentGiven: true,
        consentDate: new Date('2024-01-05'),
    },
];

// Mock cognitive profile
export const mockCognitiveProfile: CognitiveProfile = {
    userId: '1',
    overallScore: 68,
    biasScores: [
        {
            biasType: 'overconfidence',
            score: 72,
            severity: 'high',
            description: 'You tend to be highly confident in your judgments, which can be a strength in decision-making but may lead to overlooking important details.',
        },
        {
            biasType: 'anchoring',
            score: 45,
            severity: 'moderate',
            description: 'You show moderate susceptibility to initial information when making decisions. Being aware of this can help you seek diverse perspectives.',
        },
        {
            biasType: 'lossAversion',
            score: 58,
            severity: 'moderate',
            description: 'You have a balanced approach to risk, though you may sometimes prioritize avoiding losses over pursuing gains.',
        },
        {
            biasType: 'herding',
            score: 35,
            severity: 'low',
            description: 'You demonstrate strong independent thinking and are less influenced by group opinions than most.',
        },
    ],
    strengths: [
        'Independent decision-making',
        'Quick to form judgments',
        'Confident in high-pressure situations',
    ],
    blindSpots: [
        'May benefit from seeking more diverse perspectives before finalizing decisions',
        'Could improve calibration between confidence and accuracy',
    ],
    completedDate: new Date('2024-02-01'),
    lastUpdated: new Date('2024-02-01'),
};

// Mock assessment tasks
export const mockAssessmentTasks: AssessmentTask[] = [
    {
        id: 'overconfidence',
        title: 'Confidence Calibration',
        description: 'Assess how well your confidence matches your actual accuracy through a series of knowledge questions.',
        biasType: 'overconfidence',
        duration: 15,
        questions: [],
        completed: true,
    },
    {
        id: 'anchoring',
        title: 'First Impressions',
        description: 'Explore how initial information influences your estimates and decisions.',
        biasType: 'anchoring',
        duration: 12,
        questions: [],
        completed: true,
    },
    {
        id: 'loss-aversion',
        title: 'Risk & Reward',
        description: 'Understand your preferences when facing potential gains and losses.',
        biasType: 'lossAversion',
        duration: 18,
        questions: [],
        completed: false,
    },
    {
        id: 'herding',
        title: 'Group Dynamics',
        description: 'Discover how group opinions influence your individual judgments.',
        biasType: 'herding',
        duration: 15,
        questions: [],
        completed: false,
    },
];

// Mock de-biasing activities
export const mockDebiasingActivities: DebiasingActivity[] = [
    {
        id: '1',
        title: 'Pre-Mortem Analysis',
        description: 'Practice imagining future failures to improve decision quality and reduce overconfidence.',
        targetBias: 'overconfidence',
        type: 'exercise',
        duration: 20,
        difficulty: 'intermediate',
        completed: false,
        progress: 0,
    },
    {
        id: '2',
        title: 'Consider the Opposite',
        description: 'Learn to actively seek information that contradicts your initial assumptions.',
        targetBias: 'anchoring',
        type: 'practice',
        duration: 15,
        difficulty: 'beginner',
        completed: true,
        progress: 100,
    },
    {
        id: '3',
        title: 'Probabilistic Thinking',
        description: 'Develop skills in thinking about outcomes in terms of probabilities rather than certainties.',
        targetBias: 'overconfidence',
        type: 'reading',
        duration: 30,
        difficulty: 'advanced',
        completed: false,
        progress: 45,
    },
    {
        id: '4',
        title: 'Decision Journal',
        description: 'Keep a structured record of your decisions to improve self-awareness and calibration.',
        targetBias: 'overconfidence',
        type: 'reflection',
        duration: 10,
        difficulty: 'beginner',
        completed: false,
        progress: 20,
    },
];

// Mock teams
export const mockTeams: Team[] = [
    {
        id: '1',
        name: 'Product Development',
        description: 'Core product team focused on feature development',
        members: ['1', '2', '4', '5'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-02-01'),
    },
    {
        id: '2',
        name: 'Marketing',
        description: 'Marketing and growth team',
        members: ['6', '7', '8'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-02-01'),
    },
];

// Mock team analytics
export const mockTeamAnalytics: TeamAnalytics = {
    teamId: '1',
    biasDistribution: [
        { biasType: 'overconfidence', averageScore: 65, memberCount: 4 },
        { biasType: 'anchoring', averageScore: 48, memberCount: 4 },
        { biasType: 'lossAversion', averageScore: 52, memberCount: 4 },
        { biasType: 'herding', averageScore: 38, memberCount: 4 },
    ],
    cognitiveDiversity: 72,
    recommendations: [
        'Team shows strong independent thinking - leverage this for brainstorming sessions',
        'Consider pairing high-confidence members with detail-oriented colleagues for critical decisions',
        'Implement structured decision-making frameworks to balance different thinking styles',
    ],
    balanceScore: 78,
};

// ============= TEAM FORMATTING MODULE MOCK DATA =============

// Mock Bias Profiles for team members
export const mockBiasProfiles: BiasProfile[] = [
    {
        userId: '1',
        biasScore: 72,
        lastAssessmentDate: new Date('2024-02-01'),
        primaryBias: 'overconfidence',
        riskLevel: 'high',
    },
    {
        userId: '2',
        biasScore: 45,
        lastAssessmentDate: new Date('2024-01-28'),
        primaryBias: 'anchoring',
        riskLevel: 'moderate',
    },
    {
        userId: '4',
        biasScore: 38,
        lastAssessmentDate: new Date('2024-01-25'),
        primaryBias: 'herding',
        riskLevel: 'low',
    },
    {
        userId: '5',
        biasScore: 65,
        lastAssessmentDate: new Date('2024-02-03'),
        primaryBias: 'lossAversion',
        riskLevel: 'high',
    },
];

// Mock Team Bias Score
export const mockTeamBiasScore: TeamBiasScore = {
    teamId: '1',
    aggregateMetric: 55, // Average of team bias scores
    highRiskCluster: mockBiasProfiles.filter((p) => p.riskLevel === 'high'),
    synergyMetric: 72, // Team compatibility metric
    lastCalculated: new Date('2024-02-05'),
};

// Mock Learning Activities (Individual & Workshop)
export const mockLearningActivities: LearningActivity[] = [
    {
        id: '1',
        activityId: 'pre-mortem-001',
        title: 'Pre-Mortem Analysis Workshop',
        description: 'Team exercise to imagine future failures and improve decision quality',
        targetBias: 'overconfidence',
        type: 'workshop',
        duration: 60,
        difficulty: 'intermediate',
        targetUsers: ['1'],
        completed: false,
        progress: 0,
    },
    {
        id: '2',
        activityId: 'consider-opposite-001',
        title: 'Consider the Opposite - Individual Deep Dive',
        description: 'Learn to actively seek information that contradicts your initial assumptions',
        targetBias: 'anchoring',
        type: 'individual',
        duration: 30,
        difficulty: 'beginner',
        targetUsers: ['2'],
        completed: false,
        progress: 0,
    },
    {
        id: '3',
        activityId: 'team-decision-framework-001',
        title: 'Structured Decision-Making Framework',
        description: 'Team workshop on implementing systematic approaches to business decisions',
        targetBias: 'herding',
        type: 'workshop',
        duration: 90,
        difficulty: 'advanced',
        targetUsers: ['1', '2', '4', '5'],
        completed: false,
        progress: 0,
    },
    {
        id: '4',
        activityId: 'risk-assessment-001',
        title: 'Risk & Reward Assessment',
        description: 'Individual module on balancing risk preferences in decision-making',
        targetBias: 'lossAversion',
        type: 'individual',
        duration: 45,
        difficulty: 'intermediate',
        targetUsers: ['5'],
        completed: false,
        progress: 0,
    },
];

// Mock Balanced Team (combines all components)
export const mockBalancedTeam: BalancedTeam = {
    teamId: '1',
    name: 'Product Development',
    members: mockBiasProfiles,
    teamBiasScore: mockTeamBiasScore,
    assignedActivities: mockLearningActivities,
    interventionHistory: [
        {
            id: 'int-001',
            teamId: '1',
            timestamp: new Date('2024-01-15'),
            strategy: 'Cognitive Diversity Focus',
            activitiesAssigned: ['1', '2'],
            outcome: 'High engagement, improved team communication',
        },
    ],
};

// Mock Individual Modules
export const mockIndividualModules: IndividualModule[] = [
    {
        id: '2',
        activityId: 'consider-opposite-001',
        title: 'Consider the Opposite - Individual Deep Dive',
        description: 'Learn to actively seek information that contradicts your initial assumptions',
        targetBias: 'anchoring',
        type: 'individual',
        duration: 30,
        difficulty: 'beginner',
        targetUsers: ['2'],
        completed: false,
        progress: 0,
        reflectionPrompts: [
            'What assumptions did you make about the problem?',
            'What evidence contradicts your initial view?',
            'How would a skeptic approach this situation?',
        ],
        resources: [
            'https://example.com/debiasing-anchoring',
            'https://example.com/case-study-anchoring',
        ],
    },
];

// Mock Team Workshops
export const mockTeamWorkshops: TeamWorkshop[] = [
    {
        id: '1',
        activityId: 'pre-mortem-001',
        title: 'Pre-Mortem Analysis Workshop',
        description: 'Team exercise to imagine future failures and improve decision quality',
        targetBias: 'overconfidence',
        type: 'workshop',
        duration: 60,
        difficulty: 'intermediate',
        targetUsers: ['1', '2', '4', '5'],
        completed: false,
        progress: 0,
        facilitator: 'Sarah Johnson',
        groupSize: 4,
        objectives: [
            'Identify potential project risks',
            'Improve decision calibration',
            'Build team consensus on mitigation strategies',
        ],
    },
    {
        id: '3',
        activityId: 'team-decision-framework-001',
        title: 'Structured Decision-Making Framework',
        description: 'Team workshop on implementing systematic approaches to business decisions',
        targetBias: 'herding',
        type: 'workshop',
        duration: 90,
        difficulty: 'advanced',
        targetUsers: ['1', '2', '4', '5'],
        completed: false,
        progress: 0,
        facilitator: 'Michael Chen',
        groupSize: 4,
        objectives: [
            'Learn decision frameworks',
            'Practice structured thinking',
            'Reduce groupthink tendencies',
        ],
    },
];
