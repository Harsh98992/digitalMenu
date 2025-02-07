import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface UserAction {
    type: string;
    timestamp: number;
    data: any;
}

@Injectable({
    providedIn: "root",
})
export class UserBehaviorService {
    private userActions = new BehaviorSubject<UserAction[]>([]);

    trackAction(type: string, data: any) {
        const action: UserAction = {
            type,
            timestamp: Date.now(),
            data,
        };
        const currentActions = this.userActions.value;
        this.userActions.next([...currentActions, action]);
    }

    getUserActions() {
        return this.userActions.asObservable();
    }
}
