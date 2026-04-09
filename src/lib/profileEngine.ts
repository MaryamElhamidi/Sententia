export type BiasSeverity = 'low' | 'moderate' | 'high';
import { hasSupabaseConfig, supabase } from '@/lib/supabaseClient';

export interface CognitiveBiasInsight {
    biasType: string;
    intensityScore: number; // 0.0 - 1.0
    biasDesc: string;
    scoreRationale: string;
    severity: BiasSeverity;
    strategy: 'AnchoringBiasStrategy' | 'OverconfidenceStrategy';
}

export interface CognitiveProfilePayload {
    profileID: number;
    userID: string;
    generationDate: string;
    summary: string;
    biases: CognitiveBiasInsight[];
    consentRecord: {
        userId: string;
        consentGiven: boolean;
        consentDate?: string;
        pipedaLogged: boolean;
    };
}

export interface DeBiasingResource {
    id: string;
    biasType: string;
    title: string;
    description: string;
    duration: string;
    type: 'reflection' | 'behavioral' | 'interactive';
    whyItHelps: string;
    steps: string[];
    reflectionPrompt: string;
}

export const deBiasingResourcesTable: DeBiasingResource[] = [
    {
        id: 'act-anchor-price-flip',
        biasType: 'Anchoring Bias',
        title: 'The Price Flip Exercise',
        description: "Look at a product price. Estimate what it would cost if you had never seen the label.",
        duration: '5 min',
        type: 'reflection',
        whyItHelps: 'This separates your raw estimate from the initial anchor to retrain independent valuation.',
        steps: [
            'Pick one product and note the listed price.',
            'Hide the listed price and write your independent estimate.',
            'Compare both values and explain the gap in one sentence.'
        ],
        reflectionPrompt: 'Which assumptions made your estimate drift toward the original anchor?'
    },
    {
        id: 'act-anchor-counter',
        biasType: 'Anchoring Bias',
        title: 'Counter-Anchor Challenge',
        description: 'Before accepting any estimate in a meeting, generate three alternative reference points.',
        duration: 'Ongoing',
        type: 'behavioral',
        whyItHelps: 'Creating counter-anchors broadens your decision frame before commitment.',
        steps: [
            'Pause when the first estimate appears.',
            'Write three alternatives from different contexts.',
            'Choose a final range only after comparing all anchors.'
        ],
        reflectionPrompt: 'Did your final range change after listing counter-anchors?'
    },
    {
        id: 'act-overconfidence-calibration',
        biasType: 'Overconfidence',
        title: 'Confidence Calibration Quiz',
        description: 'Answer 10 trivia questions and rate confidence for each answer from 0 to 100.',
        duration: '10 min',
        type: 'interactive',
        whyItHelps: 'It creates a measurable link between confidence and actual accuracy.',
        steps: [
            'Answer each question without revising.',
            'Add a confidence percentage beside every answer.',
            'Score correctness and compare confidence average to accuracy average.'
        ],
        reflectionPrompt: 'Where did confidence exceed evidence, and what cue did you miss?'
    },
    {
        id: 'act-overconfidence-premortem',
        biasType: 'Overconfidence',
        title: 'Pre-mortem Thinking',
        description: 'Assume your project failed and list all plausible reasons before execution.',
        duration: '15 min',
        type: 'reflection',
        whyItHelps: 'Pre-mortems force risk awareness and reduce certainty bias.',
        steps: [
            'Write the project goal in one sentence.',
            'Assume failure happened 6 months later.',
            'List at least five concrete failure causes and one mitigation each.'
        ],
        reflectionPrompt: 'Which failure cause surprised you the most once you wrote it down?'
    }
];

class AnchoringBiasStrategy {
    scoreFromIntensity(intensityScore: number) {
        return Math.round(intensityScore * 100);
    }

    severityFromIntensity(intensityScore: number): BiasSeverity {
        if (intensityScore >= 0.85) return 'high';
        if (intensityScore >= 0.6) return 'moderate';
        return 'low';
    }
}

class OverconfidenceStrategy {
    scoreFromIntensity(intensityScore: number) {
        return Math.round(intensityScore * 100);
    }

    severityFromIntensity(intensityScore: number): BiasSeverity {
        if (intensityScore >= 0.85) return 'high';
        if (intensityScore >= 0.6) return 'moderate';
        return 'low';
    }
}

export const strategyRegistry = {
    AnchoringBiasStrategy: new AnchoringBiasStrategy(),
    OverconfidenceStrategy: new OverconfidenceStrategy()
};

const baseProfileSeed: Omit<CognitiveProfilePayload, 'userID' | 'consentRecord'> = {
    profileID: 1042,
    generationDate: '2025-04-09',
    summary: 'Your profile shows moderate anchoring bias and high overconfidence in estimation tasks.',
    biases: [
        {
            biasType: 'Anchoring Bias',
            intensityScore: 0.72,
            biasDesc: 'You tend to rely heavily on the first piece of information you encounter when making decisions.',
            scoreRationale: 'In estimate-revision tasks, your final answer stayed close to the first number shown in 7 of 10 scenarios.',
            severity: 'moderate',
            strategy: 'AnchoringBiasStrategy'
        },
        {
            biasType: 'Overconfidence',
            intensityScore: 0.88,
            biasDesc: 'You consistently overestimate the accuracy of your own knowledge and predictions.',
            scoreRationale: 'Your average confidence was 84%, while actual accuracy was 56% across confidence-calibration questions.',
            severity: 'high',
            strategy: 'OverconfidenceStrategy'
        }
    ]
};

function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

export class UserProfileRepo {
    private seed = deepCopy(baseProfileSeed);
    private consentByUser: Record<string, CognitiveProfilePayload['consentRecord']> = {};

    fetchProfileByUserId(userId: string): CognitiveProfilePayload {
        return {
            ...deepCopy(this.seed),
            userID: userId,
            consentRecord: this.getConsentRecord(userId)
        };
    }

    getConsentRecord(userId: string) {
        return this.consentByUser[userId] || {
            userId,
            consentGiven: false,
            pipedaLogged: false
        };
    }

    updateConsentRecord(userId: string, consent: CognitiveProfilePayload['consentRecord']) {
        this.consentByUser[userId] = { ...consent, userId };
        return this.getConsentRecord(userId);
    }
}

export class ImprovementActivityLog {
    async findActivityByBias(biasType: string) {
        const activities = await this.listAllActivities();
        return activities.filter((item) => item.biasType === biasType).slice(0, 3);
    }

    async listAllActivities() {
        if (hasSupabaseConfig && supabase) {
            const { data, error } = await supabase
                .from('de_biasing_resources')
                .select('*');

            if (!error && Array.isArray(data) && data.length > 0) {
                return data.map((row: any) => ({
                    id: String(row.id),
                    biasType: row.bias_type || row.biasType || 'Overconfidence',
                    title: row.title,
                    description: row.description,
                    duration: row.duration,
                    type: row.type,
                    whyItHelps: row.why_it_helps || row.whyItHelps || 'This activity improves your awareness through deliberate practice.',
                    steps: Array.isArray(row.steps) ? row.steps : deBiasingResourcesTable[0].steps,
                    reflectionPrompt: row.reflection_prompt || row.reflectionPrompt || 'What did you notice in your own thinking pattern?'
                })) as DeBiasingResource[];
            }
        }

        return deepCopy(deBiasingResourcesTable);
    }

    async findActivityById(activityId: string) {
        if (hasSupabaseConfig && supabase) {
            const { data, error } = await supabase
                .from('de_biasing_resources')
                .select('*')
                .eq('id', activityId)
                .maybeSingle();

            if (!error && data) {
                return {
                    id: String(data.id),
                    biasType: data.bias_type || data.biasType || 'Overconfidence',
                    title: data.title,
                    description: data.description,
                    duration: data.duration,
                    type: data.type,
                    whyItHelps: data.why_it_helps || data.whyItHelps || 'This activity improves your awareness through deliberate practice.',
                    steps: Array.isArray(data.steps) ? data.steps : deBiasingResourcesTable[0].steps,
                    reflectionPrompt: data.reflection_prompt || data.reflectionPrompt || 'What did you notice in your own thinking pattern?'
                } as DeBiasingResource;
            }
        }

        return deBiasingResourcesTable.find((item) => item.id === activityId) || null;
    }
}

export class PIPEDALogger {
    private logs: Array<{ userId: string; action: string; timestamp: string }> = [];

    log(userId: string, action: string) {
        const entry = {
            userId,
            action,
            timestamp: new Date().toISOString()
        };
        this.logs.push(entry);
        return entry;
    }

    getLastLog() {
        return this.logs.at(-1) || null;
    }
}

export class RealProfileService {
    constructor(private userRepo: UserProfileRepo, private activityLog: ImprovementActivityLog) {}

    getProfileData(userId: string) {
        return {
            profile: this.userRepo.fetchProfileByUserId(userId),
            consentRecord: this.userRepo.getConsentRecord(userId),
            activityLog: this.activityLog
        };
    }

    updateConsent(userId: string, consent: CognitiveProfilePayload['consentRecord']) {
        return this.userRepo.updateConsentRecord(userId, consent);
    }
}

export class ProfileProxy {
    constructor(private realService: RealProfileService, private logger: PIPEDALogger) {}

    getProfileData(userId: string) {
        this.logger.log(userId, 'PROFILE_READ');
        return this.realService.getProfileData(userId);
    }

    handleConsentUpdate(userId: string, consent: CognitiveProfilePayload['consentRecord']) {
        this.logger.log(userId, 'CONSENT_UPDATED');
        return this.realService.updateConsent(userId, consent);
    }
}

export class ProfileController {
    constructor(private proxy: ProfileProxy) {}

    onViewProfile(userId: string) {
        const result = this.proxy.getProfileData(userId);
        return {
            ...result,
            hasValidConsent: Boolean(result.consentRecord?.consentGiven)
        };
    }
}

const repository = new UserProfileRepo();
const activityLog = new ImprovementActivityLog();
const logger = new PIPEDALogger();
const service = new RealProfileService(repository, activityLog);
const proxy = new ProfileProxy(service, logger);
const controller = new ProfileController(proxy);

export const profileRuntime = {
    repository,
    activityLog,
    logger,
    service,
    proxy,
    controller
};
