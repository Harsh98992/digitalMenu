import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {

  constructor() { }

  // Method to store customer details
  storeCustomerDetails(name: string, phoneNumber: string): void {
    // Assuming you want to store in localStorage for simplicity
    localStorage.setItem('customerName', name);
    localStorage.setItem('customerPhoneNumber', phoneNumber);
  }

  // Method to retrieve customer details
  getCustomerDetails(): { name: string, phoneNumber: string } {
    const name = localStorage.getItem('customerName');
    const phoneNumber = localStorage.getItem('customerPhoneNumber');
    return { name: name, phoneNumber: phoneNumber };
  }
}
