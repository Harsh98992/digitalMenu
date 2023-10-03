import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root",
})
export class UtilService {
    constructor(private _snackBar: MatSnackBar) {}
    openSnackBar(message: string, errorFlag = false, duration = 5000) {
        this._snackBar.open(message, "Ok", {
            duration,
            panelClass: errorFlag ? "red-snackbar" : "green-snackbar",
            verticalPosition: 'top',
            horizontalPosition: 'end',
        });
    }

    getDistanceFromLatLonInKm(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    }
}
