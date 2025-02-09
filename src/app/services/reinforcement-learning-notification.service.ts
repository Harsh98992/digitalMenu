import { Injectable } from "@angular/core";
import { UserBehaviorService, UserAction } from "./user-behavior.service";

interface State {
    timeOfDay: number;
    dayOfWeek: number;
    lastActions: string[];
}

@Injectable({
    providedIn: "root",
})
export class ReinforcementLearningNotificationService {
    private qTable: Map<string, Map<string, number>> = new Map();
    private learningRate = 0.1;
    private discountFactor = 0.9;
    private possibleActions = ['viewMenu', 'orderFood', 'checkOffers'];

    constructor(private userBehaviorService: UserBehaviorService) {
        this.initializeModel();
        this.initializeDefaultQValues();
    }

    private initializeModel() {
        this.userBehaviorService.getUserActions().subscribe((actions) => {
            this.updateModel(actions);
        });
    }

    private initializeDefaultQValues() {
        // Initialize with some default values for common states
        const defaultState = {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            lastActions: []
        };
        
        const stateKey = JSON.stringify(defaultState);
        const actionValues = new Map<string, number>();
        
        // Set initial values for each action
        this.possibleActions.forEach(action => {
            actionValues.set(action, 1.0); // Initial optimistic value
        });
        
        this.qTable.set(stateKey, actionValues);
        console.log('Initialized Q-table:', this.qTable);
    }

    private updateModel(actions: UserAction[]) {
        if (actions.length < 2) return;

        const currentState = this.getCurrentState(actions);
        const nextAction = this.predictNextAction(currentState);
        console.log("Next action predicted:", nextAction);
        this.updateQTable(currentState, nextAction);
    }

    private getCurrentState(actions: UserAction[]): State {
        return {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            lastActions: actions.slice(-3).map((a) => a.type),
        };
    }

    predictNextAction(state: State): string {
        const stateKey = JSON.stringify(state);
        let actionValues = this.qTable.get(stateKey);

        // If no values exist for this state, initialize them
        if (!actionValues || actionValues.size === 0) {
            actionValues = new Map();
            this.possibleActions.forEach(action => {
                actionValues.set(action, 1.0);
            });
            this.qTable.set(stateKey, actionValues);
        }

        console.log('Current Q-table state:', {
            state: stateKey,
            actionValues: Array.from(actionValues.entries())
        });

        // Default to a random action if no clear winner
        if (actionValues.size === 0) {
            const randomAction = this.possibleActions[Math.floor(Math.random() * this.possibleActions.length)];
            console.log('Using random action:', randomAction);
            return randomAction;
        }

        const entries = Array.from(actionValues.entries());
        const predictedAction = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
        console.log('Predicted action:', predictedAction);
        return predictedAction;
    }

    private updateQTable(state: State, action: string) {
        const stateKey = JSON.stringify(state);
        if (!this.qTable.has(stateKey)) {
            this.qTable.set(stateKey, new Map());
        }

        const actionValues = this.qTable.get(stateKey)!;
        const oldValue = actionValues.get(action) || 0;
        const reward = 1; // Simple reward function

        const newValue =
            oldValue +
            this.learningRate *
                (reward +
                    this.discountFactor * this.getMaxFutureValue(state) -
                    oldValue);

        actionValues.set(action, newValue);
        console.log("QTable updated for state:", state, "action:", action, "newValue:", newValue);
    }

    private getMaxFutureValue(state: State): number {
        const stateKey = JSON.stringify(state);
        const actionValues = this.qTable.get(stateKey);
        if (!actionValues) return 0;
        const maxValue = Math.max(...Array.from(actionValues.values()));
        console.log("Max future value:", maxValue, "State:", state);
        return maxValue;
    }
}
