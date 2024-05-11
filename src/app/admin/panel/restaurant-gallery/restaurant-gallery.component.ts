import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ImageUploadComponent } from "./image-upload/image-upload.component";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-restaurant-gallery",
    templateUrl: "./restaurant-gallery.component.html",
    styleUrls: ["./restaurant-gallery.component.scss"],
})
export class RestaurantGalleryComponent implements OnInit {
    bannerImg = "";
    mobileBannerImg = "";
    smallImg= "";
    restaurantImages = [];
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.getRestaurantDetail();
    }
    getRestaurantDetail() {
        this.restaurantService.restaurantData
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    if (res && res.restaurantBackgroundImage) {
                        this.bannerImg = res.restaurantBackgroundImage;

                        this.restaurantImages = res.restaurantImages;
                    } else {
                        this.bannerImg = "../assets/img/detail_1.jpg";
                        this.restaurantImages = res.restaurantImages;
                    }
                    if (res && res.restaurantBackgroundImageForMobile) {
                        this.mobileBannerImg = res.restaurantBackgroundImageForMobile;

                        this.restaurantImages = res.restaurantImages;

                    }
                    else {
                        this.mobileBannerImg = "../assets/img/detail_1.jpg";
                        this.restaurantImages = res.restaurantImages;
                    }

                    // console.log(res);
                    if (res && res.restaurantBackgroundImageForSmall) {
                        this.smallImg = res.restaurantBackgroundImageForSmall;

                        this.restaurantImages = res.restaurantImages;

                    }
                    else {
                        this.smallImg = "../assets/img/detail_1.jpg";
                        this.restaurantImages = res.restaurantImages;
                    }
                },
            });
    }
    deleteImage(img: string) {
        this.restaurantService.deleteRestaurantImage({ image: img }).subscribe({
            next: (res: any) => {
                this.restaurantService.setRestaurantData(res);
            },
        });
    }
    openImageUploadPopUp(bannerFlag: string) {
        const data = { bannerFlag };
        let dialogRef = this.dialog
            .open(ImageUploadComponent, {
                disableClose: true,
                data: data,
                panelClass: "app-full-bleed-dialog",
            })
            .afterClosed()
            .subscribe({
                next: (res) => {
                    if (res && res.successFlag) {
                        this.restaurantService.setRestaurantData();
                    }
                },
            });
    }

    openImageUploadPopUpForMobile(bannerFlag: string) {
        const data = { bannerFlag };
        let dialogRef = this.dialog
            .open(ImageUploadComponent, {
                disableClose: true,
                data: data,
                panelClass: "app-full-bleed-dialog",
            })
            .afterClosed()
            .subscribe({
                next: (res) => {
                    if (res && res.successFlag) {
                        this.restaurantService.setRestaurantData();
                    }
                },
            });
    }

    openImageUploadPopUpForSmall(bannerFlag: string) {
        const data = { bannerFlag };
        let dialogRef = this.dialog
            .open(ImageUploadComponent, {
                disableClose: true,
                data: data,
                panelClass: "app-full-bleed-dialog",
            })
            .afterClosed()
            .subscribe({
                next: (res) => {
                    if (res && res.successFlag) {
                        this.restaurantService.setRestaurantData();
                    }
                },
            });
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
