import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatBadgeModule } from "@angular/material/badge";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatChipsModule } from "@angular/material/chips";
import { RepeatDialogComponent } from "./repeat-dialog/repeat-dialog.component";

import { MatRadioModule } from "@angular/material/radio";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTabsModule } from "@angular/material/tabs";

import { QRCodeModule } from "angularx-qrcode";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { AvatarModule } from "ngx-avatars";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FileUploadModule } from "@iplab/ngx-file-upload";
import { PhoneOtpComponent } from "./phone-otp/phone-otp.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatSidenavModule} from '@angular/material/sidenav';
import { OrderRecievedDialogComponent } from './order-recieved-dialog/order-recieved-dialog.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { CustomerNameDialogComponent } from './customer-name-dialog/customer-name-dialog.component';



@NgModule({
    declarations: [
        ConfirmDialogComponent,
        RepeatDialogComponent,
        NotFoundComponent,
        ContactUsComponent,
        PhoneOtpComponent,
        OrderRecievedDialogComponent,
        PaymentDialogComponent,
        CustomerNameDialogComponent,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
    ],
    exports: [
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatMenuModule,
        MatExpansionModule,
        NgSelectModule,
        NgxDatatableModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatBadgeModule,
        MatSlideToggleModule,
        ConfirmDialogComponent,
        MatStepperModule,
        MatChipsModule,
        RepeatDialogComponent,
        MatRadioModule,
        NotFoundComponent,
        MatTabsModule,
        NgbModule,
        MatToolbarModule,
        MatIconModule,
        QRCodeModule,
        AvatarModule,
        MatAutocompleteModule,
        FileUploadModule,
        MatSidenavModule
    ],
})
export class AngularMaterialModule {}
