import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestaurantPanelService } from 'src/app/api/restaurant-panel.service';
import { UtilService } from 'src/app/api/util.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  fileChooseText = 'Choose file';
  selectedFile: File;
  base64: unknown;
  showErrorFlag = false;
  constructor(
    private restaurantService: RestaurantPanelService,
    private utilService: UtilService,
    private dialogRef: MatDialogRef<ImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  async imageUpload(event) {
    this.selectedFile = event.target.files[0];
    this.base64 = await this.convertToBase64(this.selectedFile);

    var input = event.srcElement;
    var fileName = input.files[0].name;
    if (fileName) {
      this.fileChooseText = fileName;
    }
  }
  convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
  uploadFile() {
    if (this.base64) {
      this.showErrorFlag = false;
      if (this.data.bannerFlag === 'desktop') {
        this.restaurantService
          .updateRestaurantBackgoundImage({ image: this.base64 })
          .subscribe({
            next: (res: any) => {
              this.restaurantService.setRestaurantData(res);
              this.dialogRef.close({
                successFlag: true
              });

            },
          });
      }
      else if (this.data.bannerFlag === 'mobile') {
        this.restaurantService
          .updateRestaurantBannerImageForMobile({ image: this.base64 })
          .subscribe({
            next: (res: any) => {
              this.restaurantService.setRestaurantData(res);
              this.dialogRef.close({
                successFlag: true
              });

            },
          });
      }
      else if (this.data.bannerFlag === 'small') {
        this.restaurantService
          .updateRestaurantBannerImageForSmall({ image: this.base64 })
          .subscribe({
            next: (res: any) => {
              this.restaurantService.setRestaurantData(res);
              this.dialogRef.close({
                successFlag: true
              });

            },
          });
      }

       else {
        this.restaurantService
          .updateRestaurantImage({ image: this.base64 })
          .subscribe({
            next: (res: any) => {
              this.restaurantService.setRestaurantData(res);
              this.dialogRef.close({
                successFlag: true
              });

            },
          });
      }
    } else {
      this.showErrorFlag = true;
    }
  }
}
