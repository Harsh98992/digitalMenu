import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RestaurantPanelService } from 'src/app/api/restaurant-panel.service';

@Component({
  selector: 'app-add-room-customer-link',
  templateUrl: './add-room-customer-link.component.html',
  styleUrls: ['./add-room-customer-link.component.scss']
})
export class AddRoomCustomerLinkComponent implements OnInit {
  linkForm: FormGroup;
  rooms = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantPanelService,
    public dialogRef: MatDialogRef<AddRoomCustomerLinkComponent>
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadRooms();
  }

  createForm() {
    this.linkForm = this.formBuilder.group({
      roomId: ['', Validators.required],
      roomName: ['', Validators.required],
      customerPhoneNumber: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{10}$')
      ]],
      customerName: ['']
    });
  }

  loadRooms() {
    this.isLoading = true;
    this.restaurantService.getAllRooms().subscribe({
      next: (res: any) => {
        if (res && res.data && res.data.rooms && res.data.rooms.room) {
          this.rooms = res.data.rooms.room.map(room => ({
            _id: room._id,
            roomName: room.roomName
          }));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.errorMessage = 'Failed to load rooms. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onRoomSelect(event) {
    const selectedRoom = this.rooms.find(room => room._id === event.value);
    if (selectedRoom) {
      this.linkForm.patchValue({
        roomName: selectedRoom.roomName
      });
    }
  }

  submitForm() {
    if (this.linkForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.linkForm.controls).forEach(key => {
        this.linkForm.get(key).markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.linkForm.value;
    
    this.restaurantService.createRoomCustomerLink(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.dialogRef.close({ success: true, data: res.data });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create link. Please try again.';
        console.error('Error creating room-customer link:', err);
      }
    });
  }

  checkForError(controlName: string, errorName: string): boolean {
    const control = this.linkForm.get(controlName);
    return control.touched && control.hasError(errorName);
  }
}
