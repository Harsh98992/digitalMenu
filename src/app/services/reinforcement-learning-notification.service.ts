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

    constructor(private userBehaviorService: UserBehaviorService) {
        this.initializeModel();
    }

    private initializeModel() {
        this.userBehaviorService.getUserActions().subscribe((actions) => {
            this.updateModel(actions);
        });
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
        const actionValues = this.qTable.get(stateKey) || new Map();
        const predictedAction = Array.from(actionValues.entries()).reduce((a, b) =>
            a[1] > b[1] ? a : b
        )[0];
        console.log("Predicted action:", predictedAction, "State:", state);
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
