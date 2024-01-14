import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { take } from "rxjs";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";
import { RestaurantService } from "src/app/restaurant/api/restaurant.service";

@Component({
    selector: "app-add-item",
    templateUrl: "./add-item.component.html",
    styleUrls: ["./add-item.component.scss"],
})
export class AddItemComponent implements OnInit {
    @ViewChild("stepper") private myStepper: MatStepper;
    dishQuantitiy = 1;
    itemPrice = 0;
    totalPrice = 0;
    extraSelected: any = [];
    dishChoicesSelected: any = [];
    itemSizeSelected = null;
    priceOneItem = 0;
    restaurantDetail: any;
    firstFormGroup = this._formBuilder.group({
        firstCtrl: ["", Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ["", Validators.required],
    });
    isEditable = true;
    choicesDataStore: any[];
    addOnStore: any[];
    constructor(
        private restaurantService: RestaurantService,
        private restaurantPanelService: RestaurantPanelService,
        private utilService: UtilService,
        private dialogRef: MatDialogRef<any>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public dish: any
    ) {}

    ngOnInit(): void {
        this.getRestaurantData();

        this.itemPrice = this.dish.dishPrice;
        this.totalPrice = this.itemPrice;
        this.priceOneItem = this.itemPrice;
        this.setItemSizeSelected();
        // this.itemSizeSelected = {
        //   name: 'complete',
        //   price: this.priceOneItem,
        // };
    }
    setItemSizeSelected() {
        if (this.dish.sizeAvailable && this.dish.sizeAvailable.length) {
            this.dish.sizeAvailable.forEach((element) => {
                if (element?.defaultSize) {
                    this.pickedSize(element);
                }
            });
        } else {
            this.getSizeAddOn();
        }
    }
    getRestaurantData() {
        this.restaurantPanelService.restaurantData.subscribe({
            next: (res: any) => {
                this.restaurantDetail = res;
            },
        });
    }
    getAddOnDetail(id: String) {
        for (const data of this.restaurantDetail.addOns) {
            if (data._id === id) {
                return data;
            }
        }
        return null;
    }
    changeDishQuantity(flag: string) {
        if (flag === "inc" && !(this.dishQuantitiy > 50)) {
            this.dishQuantitiy += 1;
            this.changePrice();
        } else if (flag === "dec" && !(this.dishQuantitiy <= 1)) {
            this.dishQuantitiy -= 1;
            this.changePrice();
        }
    }
    getChooseText(val: number) {
        return `Choose Any ${val}`;
    }
    getDishChoicesData() {
        const result = [];
        for (const data of this.dish.choicesAvailable) {
            for (const choiceData of this.restaurantDetail.dishChoices) {
                if (choiceData._id === data.choicesId) {
                    result.push(choiceData);
                }
            }
        }
        this.choicesDataStore = result;
        return result;
    }
    getSizeAddOn() {
        const result = [];
        if (this.itemSizeSelected) {
            const filterAddOn = this.dish.addOns.filter((data) => {
                return (
                    data.size === this.itemSizeSelected.size ||
                    data.size === "All"
                );
            });

            for (const data of filterAddOn) {
                for (const addon of this.restaurantDetail.addOns) {
                    if (addon._id === data.addOnGroupId) {
                        result.push(addon);
                    }
                }
            }
            this.addOnStore = [];
            setTimeout(() => {
                this.addOnStore = [...result];
            }, 0);

            return result;
        } else if (this.dish?.sizeAvailable?.length === 0) {
            for (const data of this.dish.addOns) {
                for (const addon of this.restaurantDetail.addOns) {
                    if (addon._id === data.addOnGroupId) {
                        result.push(addon);
                    }
                }
            }
            this.addOnStore = [];
            setTimeout(() => {
                this.addOnStore = [...result];
            }, 0);
            return result;
        }

        return [];
    }
    pickedSize(item: any) {
        this.itemSizeSelected = item;
        this.itemPrice = item.price;
        this.extraSelected = [];
        this.getSizeAddOn();

        this.changePrice();
        this.myStepper?.next();
    }
    pickedChoices(item: any, choicesGroup: any, event: any) {
        const elementIdx = this.dishChoicesSelected.findIndex((data) => {
            return data.elementId === choicesGroup._id;
        });

        if (event.target.checked) {
            if (elementIdx === -1) {
                this.dishChoicesSelected.push({
                    elementId: choicesGroup._id,
                    choicesDisplayName: choicesGroup.choicesDisplayName,
                    choicesSelected: [item],
                });
            } else {
                if (
                    this.dishChoicesSelected[elementIdx].choicesSelected
                        .length >= choicesGroup.choicesMaxValue
                ) {
                    this.utilService.openSnackBar(
                        `We're sorry, but you can only choose a maximum of ${choicesGroup.choicesMaxValue} ${choicesGroup.choicesDisplayName}`,
                        true
                    );
                    event.target.checked = false;
                    return;
                }

                this.dishChoicesSelected[elementIdx].choicesSelected.push(item);
            }
        } else {
            this.dishChoicesSelected[elementIdx].choicesSelected.splice(
                this.dishChoicesSelected[elementIdx].choicesSelected.findIndex(
                    function (i: any) {
                        return (
                            i.choiceName.toLowerCase() ===
                            item.choiceName.toLowerCase()
                        );
                    }
                ),
                1
            );
            if (!this.dishChoicesSelected[elementIdx].choicesSelected.length) {
                this.dishChoicesSelected.splice(elementIdx, 1);
            }
        }
    }
    pickIngredents(item: any, addOnGroup: any, event: any) {
        const elementIdx = this.extraSelected.findIndex((data) => {
            return data.elementId === addOnGroup._id;
        });

        if (event.target.checked) {
            if (elementIdx === -1) {
                this.extraSelected.push({
                    elementId: addOnGroup._id,
                    addOnsSelected: [item],
                    addOnDisplayName: addOnGroup.addOnDisplayName,
                });
            } else {
                if (
                    this.extraSelected[elementIdx].addOnsSelected.length >=
                    addOnGroup.addOnMaxValue
                ) {
                    this.utilService.openSnackBar(
                        `We're sorry, but you can only choose a maximum of ${addOnGroup.addOnMaxValue} ${addOnGroup.addOnDisplayName}`,
                        true
                    );
                    event.target.checked = false;
                    return;
                }

                this.extraSelected[elementIdx].addOnsSelected.push(item);
            }
        } else {
            this.extraSelected[elementIdx].addOnsSelected.splice(
                this.extraSelected[elementIdx].addOnsSelected.findIndex(
                    function (i: any) {
                        return (
                            i.addOnName.toLowerCase() ===
                            item.addOnName.toLowerCase()
                        );
                    }
                ),
                1
            );
            if (!this.extraSelected[elementIdx].addOnsSelected.length) {
                this.extraSelected.splice(elementIdx, 1);
            }
        }

        // if (event.target.checked) {
        //   console.log(this.extraSelected);

        //   console.log(item);

        //   this.extraSelected.push(item);
        // } else {
        //   this.extraSelected.splice(
        //     this.extraSelected.findIndex(function (i: any) {
        //       return i.addOnName.toLowerCase() === item.addOnName.toLowerCase();
        //     }),
        //     1
        //   );
        // }

        this.changePrice();
    }
    changePrice() {
        this.totalPrice = this.itemPrice;
        for (const item of this.extraSelected) {
            for (const extra of item.addOnsSelected) {
                this.totalPrice += extra.addOnPrice;
            }
        }
        this.priceOneItem = this.totalPrice;
        this.totalPrice = this.totalPrice * this.dishQuantitiy;
    }
    addItemToCart() {
        const data: any = {};

        const result = this.checkForErrorInSelection();
        if (result) {
            return;
        }

        data["totalPrice"] = this.totalPrice;
        data["priceOneItem"] = this.priceOneItem;
        data["dishQuantity"] = this.dishQuantitiy;
        data["itemSizeSelected"] = this.itemSizeSelected;
        data["extraSelected"] = this.extraSelected;
        data["dishChoicesSelected"] = this.dishChoicesSelected;
        data["dishDetail"] = this.dish;
        
        const storeData = {
            dishId: this.dish._id,
            cartItems: [data],
        };
        this.restaurantService
            .getCartItem()
            .pipe(take(1))
            .subscribe((res: any) => {
                let initalValue = res;
                let flag = true;
                for (let cartData of initalValue) {
                    if (cartData.dishId === this.dish._id) {
                        flag = false;
                        cartData["cartItems"].push(data);
                        break;
                    }
                }
                if (flag) {
                    initalValue.push(storeData);
                }

                this.restaurantService.setCartItem(initalValue);
                this.restaurantService.setRestaurantUrl(
                    this.restaurantDetail?.restaurantUrl
                );
                this.dialogRef.close();
            });
    }
    checkForErrorInSelection() {
        for (const choiceData of this.choicesDataStore) {
            const choiceSelectData = this.dishChoicesSelected.find((data) => {
                return data.elementId === choiceData._id;
            });
            if (!choiceSelectData && choiceData.choicesMinValue !== 0) {
                this.utilService.openSnackBar(
                    `Please select at least ${
                        choiceData.choicesMinValue
                    } ${this.convertToTitleCase(
                        choiceData.choicesDisplayName
                    )} from the available options before proceeding`,
                    true
                );
                return true;
            } else if (
                choiceSelectData &&
                choiceSelectData?.choicesSelected?.length &&
                choiceSelectData.choicesSelected.length <
                    choiceData.choicesMinValue
            ) {
                this.utilService.openSnackBar(
                    `Please select at least ${
                        choiceData.choicesMinValue
                    } ${this.convertToTitleCase(
                        choiceData.choicesDisplayName
                    )} from the available options before proceeding`,
                    true
                );
                return true;
            }
        }
        for (const addonData of this.addOnStore) {
            const addOnSelectedData = this.extraSelected.find((data) => {
                return data.elementId === addonData._id;
            });
            if (!addOnSelectedData && addonData.addOnMinValue !== 0) {
                this.utilService.openSnackBar(
                    `Please select at least ${
                        addonData.addOnMinValue
                    } ${this.convertToTitleCase(
                        addonData.addOnDisplayName
                    )} from the available options before proceeding`,
                    true
                );
                return true;
            } else if (
                addOnSelectedData &&
                addOnSelectedData?.addOnsSelected?.length &&
                addOnSelectedData.addOnsSelected.length <
                    addonData.addOnMinValue
            ) {
                this.utilService.openSnackBar(
                    `Please select at least ${
                        addonData.addOnMinValue
                    } ${this.convertToTitleCase(
                        addonData.addOnDisplayName
                    )} from the available options before proceeding`,
                    true
                );
                return true;
            }
        }
        return false;
    }
    convertToTitleCase(str) {
        return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    }

    onSizeSelect() {
        this.myStepper.next();
    }
    onChoiceSelect() {
        this.myStepper.next();
    }
    onExtraSelect() {
        this.myStepper.next();
    }
}
