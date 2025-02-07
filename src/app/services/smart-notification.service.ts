import { Injectable } from "@angular/core";
import { ReinforcementLearningNotificationService } from "./reinforcement-learning-notification.service";

@Injectable({
    providedIn: "root",
})
export class SmartNotificationService {
    constructor(private rlService: ReinforcementLearningNotificationService) {}

    async sendPersonalizedNotification() {
        const currentState = {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            lastActions: [], // Get from recent actions
        };

        const predictedAction = this.rlService.predictNextAction(currentState);

        // Generate appropriate notification based on predicted action
        const notification = this.generateNotification(predictedAction);

        if (notification) {
            // You can integrate with your preferred notification system here
            this.showNotification(notification);
        }
    }

    private generateNotification(predictedAction: string): string {
        const notifications: { [key: string]: string } = {
            viewMenu:
                "Looking for something to eat? Check out our latest menu!",
            orderFood: "Ready for another delicious meal?",
            checkOffers: "We have some great deals just for you!",
        };

        return notifications[predictedAction] || "";
    }

    private showNotification(message: string) {
        // Implement your notification display logic here
        // This could be a toast, push notification, or in-app alert
        console.log("Smart Notification:", message);
    }
}
