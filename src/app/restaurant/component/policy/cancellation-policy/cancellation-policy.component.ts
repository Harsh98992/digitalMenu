import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

}
