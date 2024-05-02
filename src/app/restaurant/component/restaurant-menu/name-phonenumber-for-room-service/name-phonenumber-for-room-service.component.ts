import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-name-phonenumber-for-room-service',
  templateUrl: './name-phonenumber-for-room-service.component.html',
  styleUrls: ['./name-phonenumber-for-room-service.component.scss']
})
export class NamePhonenumberForRoomServiceComponent implements OnInit {
  name: string;
  phoneNumber: string;

  constructor(private dialogRef: MatDialogRef<NamePhonenumberForRoomServiceComponent>) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveData(): void {
    if (this.name.trim() !== '') {
      this.dialogRef.close({ name: this.name, phoneNumber: this.phoneNumber });
    } else {
      alert('Please enter a name.');
    }
  }
}
