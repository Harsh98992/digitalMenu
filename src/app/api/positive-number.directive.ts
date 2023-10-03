import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: "[appPositiveNumber]",
})
export class PositiveNumberDirective {
    constructor(private el: ElementRef) {}

    @HostListener("input", ["$event"])
    onInputChange(event: Event): void {
        const inputElement = this.el.nativeElement as HTMLInputElement;
        const inputValue = inputElement.value;

        // Remove any non-numeric characters
        const numericValue = inputValue.replace(/[^0-9.]/g, "");

        // Ensure the value is not empty and is a valid positive number
        if (numericValue.length > 0 && !isNaN(parseFloat(numericValue)) && parseFloat(numericValue) >= 0) {
            inputElement.value = numericValue;
        } else {
            inputElement.value = ""; // Clear the input if it's not a valid positive number
        }
    }
}
