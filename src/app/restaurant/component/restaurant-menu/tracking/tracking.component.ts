import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  option1Form: FormGroup;
  option2Form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.option1Form = this.formBuilder.group({
      restaurantName: ['', Validators.required],
      customerName: ['', Validators.required],
      roomName: ['', Validators.required]
    });

    this.option2Form = this.formBuilder.group({
      trackingId: ['', Validators.required]
    });
  }
  ngOnInit(): void {


  }

  submitOption1() {
    console.log(this.option1Form.value);
  }

  submitOption2() {
    console.log(this.option2Form.value);
  }

  ngOnInait(): void {
  }
}
