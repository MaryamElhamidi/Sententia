export const mockInsightEnginePayload = {
    profileID: 1042,
    userID: 7,
    generationDate: '2025-04-09',
    summary: 'Your profile shows moderate anchoring bias and high overconfidence in estimation tasks.',
    biases: [
        {
            biasType: 'Anchoring Bias',
            intensityScore: 0.72,
            biasDesc: 'You tend to rely heavily on the first piece of information you encounter when making decisions.',
            strategy: 'AnchoringBiasStrategy'
        },
        {
            biasType: 'Overconfidence',
            intensityScore: 0.88,
            biasDesc: 'You consistently overestimate the accuracy of your own knowledge and predictions.',
            strategy: 'OverconfidenceStrategy'
        }
    ],
    activities: [
        {
            biasType: 'Anchoring Bias',
            title: 'The Price Flip Exercise',
            description: "Look at a product price. Now estimate what it would cost if you'd never seen the label. Write both numbers down and compare.",
            duration: '5 min',
            type: 'reflection'
        },
        {
            biasType: 'Anchoring Bias',
            title: 'Counter-Anchor Challenge',
            description: 'Before accepting any estimate in a meeting, generate three alternative reference points on your own first.',
            duration: 'ongoing',
            type: 'behavioral'
        },
        {
            biasType: 'Overconfidence',
            title: 'Confidence Calibration Quiz',
            description: 'Answer 10 trivia questions and rate your confidence for each (0-100%). Track how often your confidence matches your accuracy.',
            duration: '10 min',
            type: 'interactive'
        },
        {
            biasType: 'Overconfidence',
            title: 'Pre-mortem Thinking',
            description: 'Before starting a project, imagine it has already failed. Write down every possible reason why. This forces you to stress-test your assumptions.',
            duration: '15 min',
            type: 'reflection'
        }
    ],
    consentRecord: {
        userId: 7,
        consentGiven: true,
        consentDate: '2025-03-15',
        pipedaLogged: true
    }
};

export class CognitiveBias {
    constructor({ biasType, intensityScore, biasDesc, strategy }) {
        this.biasType = biasType;
        this.intensityScore = intensityScore;
        this.biasDesc = biasDesc;
        this.strategy = strategy;
    }

    calculateSeverity() {
        if (this.intensityScore >= 0.85) return 'High';
        if (this.intensityScore >= 0.6) return 'Moderate';
        return 'Low';
    }
}

export class CognitiveProfile {
    constructor({ profileID, userID, summary, generationDate, biases }) {
        this.profileID = profileID;
        this.userID = userID;
        this.summary = summary;
        this.generationDate = generationDate;
        this.biases = biases.map((bias) => new CognitiveBias(bias));
    }

    toJSONFormat() {
        return {
            profileID: this.profileID,
            userID: this.userID,
            summary: this.summary,
            generationDate: this.generationDate,
            biases: this.biases.map((bias) => ({
                biasType: bias.biasType,
                intensityScore: bias.intensityScore,
                biasDesc: bias.biasDesc,
                strategy: bias.strategy,
                severity: bias.calculateSeverity()
            }))
        };
    }
}

export class ImprovementActivityLog {
    constructor(activities) {
        this.activities = activities;
    }

    findActivityByBias(biasType) {
        return this.activities.filter((activity) => activity.biasType === biasType).slice(0, 3);
    }
}

export class AnchoringBiasStrategy {
    calculateScore(intensityScore) {
        return Math.round(intensityScore * 100);
    }

    getMitigationReferences() {
        return ['Generate independent estimates before seeing any anchor.', 'Use at least three reference points before settling.'];
    }
}

export class OverconfidenceStrategy {
    calculateScore(intensityScore) {
        return Math.round(intensityScore * 100);
    }

    getMitigationReferences() {
        return ['Track confidence vs. real outcomes weekly.', 'Run pre-mortems to challenge assumptions.'];
    }
}

export class UserProfileRepo {
    constructor(seedData) {
        this.data = JSON.parse(JSON.stringify(seedData));
    }

    fetchProfileByUserId(userId) {
        return new CognitiveProfile({
            ...this.data,
            userID: userId
        });
    }

    getConsentRecord(userId) {
        return {
            ...this.data.consentRecord,
            userId
        };
    }

    updateConsentRecord(userId, consentRecord) {
        this.data.consentRecord = { ...consentRecord, userId };
        return this.getConsentRecord(userId);
    }
}

export class PIPEDALogger {
    constructor() {
        this.logs = [];
    }

    log(userId, action = 'PROFILE_ACCESS') {
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
    constructor(userProfileRepo, activityLog) {
        this.userProfileRepo = userProfileRepo;
        this.activityLog = activityLog;
    }

    getProfileData(userId) {
        return {
            profile: this.userProfileRepo.fetchProfileByUserId(userId),
            consentRecord: this.userProfileRepo.getConsentRecord(userId),
            activityLog: this.activityLog
        };
    }

    updateConsent(userId, consentRecord) {
        return this.userProfileRepo.updateConsentRecord(userId, consentRecord);
    }
}

export class ProfileProxy {
    constructor(realProfileService, accessLogger) {
        this.realProfileService = realProfileService;
        this.accessLogger = accessLogger;
    }

    getProfileData(userId) {
        this.accessLogger.log(userId, 'PROFILE_READ');
        return this.realProfileService.getProfileData(userId);
    }

    handleConsentUpdate(userId, consentRecord) {
        this.accessLogger.log(userId, 'CONSENT_UPDATED');
        return this.realProfileService.updateConsent(userId, consentRecord);
    }
}

export class ProfileController {
    constructor(profileProxy) {
        this.profileProxy = profileProxy;
    }

    onViewProfile(userId) {
        const result = this.profileProxy.getProfileData(userId);
        return {
            ...result,
            hasValidConsent: Boolean(result.consentRecord?.consentGiven)
        };
    }
}

export const strategyRegistry = {
    AnchoringBiasStrategy: new AnchoringBiasStrategy(),
    OverconfidenceStrategy: new OverconfidenceStrategy()
};

export function createCognitiveProfileRuntime(seedData = mockInsightEnginePayload) {
    const repository = new UserProfileRepo(seedData);
    const logger = new PIPEDALogger();
    const activityLog = new ImprovementActivityLog(seedData.activities);
    const service = new RealProfileService(repository, activityLog);
    const proxy = new ProfileProxy(service, logger);
    const controller = new ProfileController(proxy);

    return {
        repository,
        logger,
        activityLog,
        service,
        proxy,
        controller
    };
}
