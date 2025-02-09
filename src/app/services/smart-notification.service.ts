import { Injectable } from "@angular/core";
import { ReinforcementLearningNotificationService } from "./reinforcement-learning-notification.service";
import { interval } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root",
})
export class SmartNotificationService {
    constructor(
        private rlService: ReinforcementLearningNotificationService,
        private snackBar: MatSnackBar
    ) {
        this.initializeNotificationSchedule();
    }

    public initializeNotificationSchedule() {
        const scheduleNextNotification = () => {
            // Random interval between 2 and 6 hours (in milliseconds)
            const randomInterval = (Math.random() * (6 - 2) + 2) * 60 * 60 * 1000;
            setTimeout(() => {
                const currentHour = new Date().getHours();
                // Only send notifications between 8 AM and 9 PM
                if (currentHour >= 8 && currentHour <= 21) {
                    this.sendPersonalizedNotification();
                }
                scheduleNextNotification();
            }, randomInterval);
        };

        scheduleNextNotification();
    }

    async sendPersonalizedNotification() {
        const currentState = {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            lastActions: ['viewMenu'], // Set a default action to start with
        };

        console.log('Sending notification with state:', currentState);
        const predictedAction = this.rlService.predictNextAction(currentState);
        console.log("Predicted action:", predictedAction);

        // Generate appropriate notification based on predicted action
        const notification = this.generateNotification(predictedAction);
        console.log("Generated notification:", notification);

        if (notification) {
            // You can integrate with your preferred notification system here
            this.showNotification(notification);
        }
    }

    private generateNotification(predictedAction: string): string {
        console.log('Generating notification for action:', predictedAction);
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

    public async showNotification(message: string): Promise<void> {
        if (!("Notification" in window)) {
            this.snackBar.open(
                "Your browser doesn't support notifications",
                "Close",
                {
                    duration: 5000,
                }
            );
            return;
        }

        const permission = await Notification.requestPermission();
        console.log(permission);
        if (permission === "denied") {
            this.snackBar
                .open(
                    "Notification permission denied. Please enable notifications in your browser settings.",
                    "Close",
                    {
                        duration: 50000,
                    }
                )
                .onAction()
                .subscribe(() => {
                    window.open(
                        "chrome://settings/content/notifications",
                        "_blank"
                    );
                });
        } else if (permission === "granted") {
            new Notification("Qrsay", {
                body: message,
                icon: "assets/icons/icon-72x72.png",
            });
        } else {
            // Fallback to snackbar if notification is blocked
            this.snackBar.open(message, "Close", {
                duration: 5000,
            });
        }
    }
}
