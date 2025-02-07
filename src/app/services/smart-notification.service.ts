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

        const permission = await Notification.permission;
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
            this.snackBar
                .open(
                    "Please allow notifications for a better experience",
                    "Allow",
                    {
                        duration: 5000,
                    }
                )
                .onAction()
                .subscribe(async () => {
                    await Notification.requestPermission();
                });
        }
    }
}
