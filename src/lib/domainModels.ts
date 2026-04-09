/**
 * Domain Models mapped directly from the System Architecture UML Class Diagram.
 * 
 * These classes represent the core business logic entities related to User Management,
 * Cognitive Bias Assessments, and Insight Engine processing.
 */

/**
 * Represents a system user. 
 * Maps directly to the 'User' class in the UML diagram.
 */
export class User {
    private userID: number;
    private name: string;

    constructor(userID: number, name: string) {
        this.userID = userID;
        this.name = name;
    }
}

/**
 * Represents a specific cognitive bias identified by the system.
 * Contains properties detailing the type, severity, and a descriptive insight.
 */
export class BiasInsight {
    private biasType: string;
    private severity: string;
    private description: string;

    constructor(biasType: string, severity: string, description: string) {
        this.biasType = biasType;
        this.severity = severity;
        this.description = description;
    }

    /**
     * Formats and returns a user-friendly string explaining the insight.
     */
    public provideBiasInsight(): string {
        return `Insight: ${this.biasType} (${this.severity}) - ${this.description}`;
    }
}

/**
 * The consolidated Cognitive Profile of a user.
 * Demonstrates a Composition relationship with BiasInsight (aggregation diamond in UML).
 */
export class CognitiveProfile {
    private profileID: number;
    private summary: string;

    // Composition relationship denoting that a CognitiveProfile holds multiple BiasInsights
    public biasInsights: BiasInsight[] = [];

    constructor(profileID: number, summary: string) {
        this.profileID = profileID;
        this.summary = summary;
    }

    /** Display the structured cognitive profile */
    public viewCognitiveProfile(): void {
        console.log(`Viewing Profile: ${this.profileID}`);
    }

    /** Retrieve recommended debiasing tasks tailored to this profile */
    public accessDebiasingTasks(): void {
        // Implementation for accessing tasks
    }

    /** View numerical bias scores associated with the profile */
    public viewBiasScore(): void {
        // Implementation to view scores
    }
}

/**
 * Tracks individual actions or choices made by a user during an assessment.
 */
export class BehaviouralData {
    private responseTime: number;
    private selectedOption: string;

    constructor(responseTime: number, selectedOption: string) {
        this.responseTime = responseTime;
        this.selectedOption = selectedOption;
    }

    /** Processes and stores the physical behavioural interaction to the persistent layer */
    public storeBehaviouralChoice(): void {
        console.log(`Storing choice: ${this.selectedOption} taking ${this.responseTime}ms`);
    }
}

/**
 * Represents a single task or question forming part of an overall assessment.
 */
export class ScenarioTask {
    private taskID: string;
    private description: string;

    constructor(taskID: string, description: string) {
        this.taskID = taskID;
        this.description = description;
    }

    /** Captures the choice selected by the user for this scenario */
    public choiceSelected(): string {
        return this.taskID;
    }
}

/**
 * The overarching assessment entity representing a collection of Scenario Tasks completed by the user.
 */
export class CognitiveBiasAssessment {
    private assessmentID: string;
    private date: Date;
    private status: string;

    constructor(assessmentID: string, date: Date, status: string) {
        this.assessmentID = assessmentID;
        this.date = date;
        this.status = status;
    }

    /** Retrieves the category/type of cognitive task being executed */
    public taskType(): string {
        return 'Cognitive Bias Task';
    }

    /** Dictates the sequence of scenario tasks shown to the user */
    public taskOrder(): void {
        // Order implementation
    }
}

/**
 * Manager component responsible for data persistence related to user test responses.
 */
export class ResponseRepository {
    /** Persists a newly completed assessment or individual response to the database */
    public saveResponse(response: any): void {
        // Implementation to save a response
    }

    /** Retrieves previous assessment response patterns for a specific user */
    public getResponse(userID: number): any {
        // Implementation to get response by ID
        return null;
    }
}

/**
 * Core analytical manager that interprets BehaviouralData and calculates structural Insight outcomes.
 */
export class InsightEngine {
    /** Synthesizes collected data to form a cohesive bias insight and profile update */
    public generateInsights(userID: number): void {
        // Engine logic
    }

    /** Mathematical processor computing numerical risks and severities based on patterns */
    public calculateBiasScores(): void {
        // Logic to compute score
    }
}

/**
 * Manager representing the active data transmission layer between the UI and backend logic.
 */
export class DataCollectionService {
    /** Routes user answers correctly into the ResponseRepository */
    public submitResponse(response: any): void {
        // Submit handler
    }

    /** Scrapes currently batched responses before Insight generation */
    public collectResponses(userID: number): any[] {
        // Retrieve collected responses
        return [];
    }
}

/**
 * Display Manager mediating interactions between the frontend tasks and backend submission systems.
 */
export class TaskUIView {
    /** Initializes the frontend assessment render loop */
    public startAssessment(): void {
        console.log("Starting Assessment...");
    }

    /** Captures frontend actions and queues them to the backend */
    public submitResponse(): void {
        console.log("Response Submitted.");
    }

    /** Triggers the UI to redirect the user dynamically once an assessment completes */
    public navigateToResults(): void {
        console.log("Navigating to Results...");
    }
}

/**
 * Display Manager handling the final presentation of the generated Bias Insights.
 */
export class ResultsView {
    /** Executes the active render of insights and analytics on screen */
    public displayInsights(): void {
        console.log("Displaying Insights...");
    }
}

// -------------------------------------------------------------
// Interfaces mapped as Abstract Classes to retain UML's private state modifiers
// -------------------------------------------------------------

/**
 * Abstract class representing the `DebiasingActivity` interface from the UML.
 * Defines the contract mapping out exercises designed to mitigate highlighted cognitive biases.
 */
export abstract class DebiasingActivity {
    private ActivityID: string;
    private title: string;

    constructor(ActivityID: string, title: string) {
        this.ActivityID = ActivityID;
        this.title = title;
    }

    /** Outlines the physical/mental steps to execute the debiasing activity */
    public abstract improvementSteps(): void;
}

/**
 * Abstract class representing the `DecisionExplained` interface from the UML.
 * Represents explanations tied to decision making logic generated by the engine.
 */
export abstract class DecisionExplained {
    private explanationText: string;

    constructor(explanationText: string) {
        this.explanationText = explanationText;
    }

    /** Allow user to review this specific decision pattern linked to a group behavior */
    public abstract viewNewGroup(): void;
    
    /** Access introductory resources surrounding this decision explanation */
    public abstract accessOnboarding(): void;
}
