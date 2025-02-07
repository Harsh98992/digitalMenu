import { Injectable } from "@angular/core";
import { ReinforcementLearningNotificationService } from "./reinforcement-learning-notification.service";
import { interval } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class SmartNotificationService {
    constructor(private rlService: ReinforcementLearningNotificationService) {
        this.initializeNotificationSchedule();
    }
    private initializeNotificationSchedule() {
        // Check every hour
        interval(3600000).subscribe(() => {
            const currentHour = new Date().getHours();

            // Common meal times
            const mealTimes = [8, 12, 18]; // 8AM, 12PM, 6PM

            if (mealTimes.includes(currentHour)) {
                this.sendPersonalizedNotification();
            }
        });
    }

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

        // Looking for something to eat? Check out our latest menu!
        // Ready for another delicious meal?
        // We have some great deals just for you!

        return notifications[predictedAction] || "";
    }

    private async showNotification(message: string) {
        // Implement your notification display logic here
        // This could be a toast, push notification, or in-app alert
        // this will be a push notification

        // ask the user to allow notifications
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            new Notification("Smart Notification", {
                body: message,
            });

            // You can also use a service worker to show notifications
            // if the user is not on the page
        }
    }
}
