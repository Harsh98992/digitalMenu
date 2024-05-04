import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-track-order",
    templateUrl: "./track-order.component.html",
    styleUrls: ["./track-order.component.scss"],
})
export class TrackOrderComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
    toggleSignup() {
        document.getElementById("login-toggle").style.backgroundColor = "#fff";
        document.getElementById("login-toggle").style.color = "#222";
        document.getElementById("signup-toggle").style.backgroundColor =
            "#57b846";
        document.getElementById("signup-toggle").style.color = "#fff";
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "block";
    }

    toggleLogin() {
        document.getElementById("login-toggle").style.backgroundColor =
            "#57B846";
        document.getElementById("login-toggle").style.color = "#fff";
        document.getElementById("signup-toggle").style.backgroundColor = "#fff";
        document.getElementById("signup-toggle").style.color = "#222";
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    }
}
