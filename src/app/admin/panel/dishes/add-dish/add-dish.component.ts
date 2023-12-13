import { Component, OnInit, ViewChild } from "@angular/core";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { RestaurantPanelService } from "src/app/api/restaurant-panel.service";
import { UtilService } from "src/app/api/util.service";
import { AddCategoryDialogComponent } from "../add-category-dialog/add-category-dialog.component";
import { MatStepper } from "@angular/material/stepper";
import { AddAddOnDialogComponent } from "../add-add-on-dialog/add-add-on-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { AddOtherOptionDialogComponent } from "../add-other-option-dialog/add-other-option-dialog.component";
import { BehaviorSubject, Subscription } from "rxjs";
import {
    FileUploadControl,
    FileUploadValidators,
} from "@iplab/ngx-file-upload";

@Component({
    selector: "app-add-dish",
    templateUrl: "./add-dish.component.html",
    styleUrls: ["./add-dish.component.scss"],
})
export class AddDishComponent implements OnInit {
    @ViewChild("stepper") private myStepper: MatStepper;

    isEditable = true;
    dishesForm: FormGroup;
    choicesForm: FormGroup;
    addOnGroupForm: FormGroup;
    selectedFile: File;
    showErrorImageFlag = false;
    fileChooseText = "Choose file";
    base64: string;
    variantsForm: FormGroup;
    categories = [];
    addOnsList = [];
    dishChoicesList = [];
    sizesAvailable = [{ size: "All" }];
    spicy = [
        { name: "Yes", result: true },
        { name: "No ", result: false },
    ];
    editFlag: any;
    radioSelected = "";

    selectedCategoryName = "";

    public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
        null
    );

    private subscription: Subscription;

    public readonly control = new FileUploadControl(
        {
            listVisible: true,
            accept: ["image/*"],
            discardInvalid: true,
            multiple: false,
        },
        [
            FileUploadValidators.accept(["image/*"]),
            FileUploadValidators.filesLimit(1),
        ]
    );
    constructor(
        private utilService: UtilService,
        public dialog: MatDialog,
        private restaurantService: RestaurantPanelService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.generateAddDishForm();
        this.getCategoryValue();
        this.subscription = this.control.valueChanges.subscribe(
            (values: Array<File>) => this.getImage(values[0])
        );

        this.dishesForm.get("dishCategory").valueChanges.subscribe((value) => {
            // get the content of the selected option
            this.categories.forEach((item) => {
                if (item._id === value) {
                    this.selectedCategoryName = item.categoryName.toLowerCase();
                }
            });

        });
    }
    private getImage(file: File): void {
        if (FileReader && file) {
            const fr = new FileReader();
            fr.onload = (e: any) => {
                this.base64 = e.target.result;

                this.uploadedFile.next(this.base64);
            };
            fr.readAsDataURL(file);
        } else {
            this.uploadedFile.next(null);
        }
    }
    getCategoryValue() {
        this.restaurantService.getCategory().subscribe({
            next: (res: any) => {
                if (res && res.data && res.data.category.length) {
                    this.categories = res.data.category;
                }
                if (res && res.data && res.data.addOns.length) {
                    this.addOnsList = res.data.addOns;
                }
                if (res && res.data && res.data.dishChoices.length) {
                    this.dishChoicesList = res.data.dishChoices;
                }
            },
        });
    }

    allDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    generateAddDishForm() {
        this.dishesForm = this.fb.group({
            dishName: ["", [Validators.required]],
            dishCategory: ["", [Validators.required]],
            dishPrice: ["", [Validators.required]],
            dishType: ["", [Validators.required]],
            dishDescription: [""],
            dishOrderOption: ["", [Validators.required]],
            spicy: ["", [Validators.required]],
            days: [""],
            dishPriority: [""],
        });
        this.variantsForm = new FormGroup({
            defaultSize: new FormControl(0, Validators.required),
            variants: new FormArray([
                new FormGroup({
                    size: new FormControl("", Validators.required),
                    price: new FormControl("", Validators.required),
                    sizeDescription: new FormControl(""),
                }),
            ]),
        });
        this.choicesForm = new FormGroup({
            choicesGroup: new FormArray([
                new FormGroup({
                    choicesId: new FormControl("", Validators.required),
                }),
            ]),
        });
        this.addOnGroupForm = new FormGroup({
            addOnGroup: new FormArray([
                new FormGroup({
                    addOnGroupId: new FormControl("", Validators.required),
                    size: new FormControl("", Validators.required),
                }),
            ]),
        });
        this.checkForEditMode();
    }
    checkForEditMode() {
        this.route.queryParams.subscribe((params) => {
            this.editFlag = params["edit"];
            if (this.editFlag) {
                const dishData = this.restaurantService.getSelectedDish();
                dishData["dishCategory"] = dishData["categoryId"];
                dishData["spicy"] = dishData["chilliFlag"];
                if (dishData) {
                    this.patchVariantForm(dishData);
                    this.patchAddOnForm(dishData);
                    this.patchDishChoicesForm(dishData);
                    this.base64 = dishData.imageUrl;

                    this.onImageChange();
                    this.dishesForm.patchValue(dishData);
                }
            } else {
                this.deleteFormField();
            }
        });
    }
    onImageChange() {
        const binaryData = atob(this.base64.split(",")[1]);
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: "image/jpeg" }); // Change the type accordingly

        // Create FormData and append the Blob to it
        const formData = new FormData();
        formData.append("imageFile", blob);

        // Patch the form control with the FormData
        this.control.setValue([formData.get("imageFile") as any]);
    }
    deleteFormField() {
        this.choicesGroup.removeAt(0);
        this.addOnGroup.removeAt(0);
        this.variants.removeAt(0);
    }
    patchDishChoicesForm(dishData: any) {
        if (dishData.choicesAvailable && dishData.choicesAvailable.length) {
            for (let i = 0; i < dishData.choicesAvailable.length - 1; i++) {
                this.choicesGroup.push(
                    new FormGroup({
                        choicesId: new FormControl("", Validators.required),
                    })
                );
            }

            this.choicesGroup.patchValue(dishData.choicesAvailable);
        } else {
            this.choicesGroup.removeAt(0);
        }
    }
    patchAddOnForm(dishData: any) {
        if (dishData.addOns && dishData.addOns.length) {
            for (let i = 0; i < dishData.addOns.length - 1; i++) {
                this.addOnGroup.push(
                    new FormGroup({
                        addOnGroupId: new FormControl("", Validators.required),
                        size: new FormControl("", Validators.required),
                    })
                );
            }

            this.addOnGroup.patchValue(dishData.addOns);
        } else {
            this.addOnGroup.removeAt(0);
        }
    }

    patchVariantForm(dishData) {
        if (dishData.sizeAvailable && dishData.sizeAvailable.length) {
            for (let i = 0; i < dishData.sizeAvailable.length - 1; i++) {
                this.variants.push(
                    new FormGroup({
                        size: new FormControl("", Validators.required),
                        price: new FormControl("", Validators.required),
                        sizeDescription: new FormControl(""),
                    })
                );
            }

            this.variants.patchValue(dishData.sizeAvailable);
        } else {
            this.variants.removeAt(0);
        }
    }
    get addOnGroup(): FormArray {
        return this.addOnGroupForm.get("addOnGroup") as FormArray;
    }
    get variants(): FormArray {
        return this.variantsForm.get("variants") as FormArray;
    }
    get choicesGroup(): FormArray {
        return this.choicesForm.get("choicesGroup") as FormArray;
    }
    addVariants() {
        this.variantsForm.markAllAsTouched();
        if (!this.variants.valid) {
            return;
        }

        this.variants.push(
            new FormGroup({
                size: new FormControl("", Validators.required),
                price: new FormControl("", Validators.required),
                sizeDescription: new FormControl(""),
            })
        );
    }
    addChoicesGroup() {
        this.choicesForm.markAllAsTouched();
        if (!this.choicesGroup.valid) {
            return;
        }

        this.choicesGroup.push(
            new FormGroup({
                choicesId: new FormControl("", Validators.required),
            })
        );
    }
    addAddon() {
        this.addOnGroupForm.markAllAsTouched();
        if (!this.addOnGroup.valid) {
            return;
        }

        this.addOnGroup.push(
            new FormGroup({
                addOnGroupId: new FormControl("", Validators.required),
                size: new FormControl("", Validators.required),
            })
        );
    }
    openAddOnDialog() {
        let dialogRef = this.dialog
            .open(AddAddOnDialogComponent, {
                disableClose: true,
                panelClass: "app-full-order-dialog",
                minWidth: "70%",
            })
            .afterClosed()
            .subscribe((data) => {
                if (data && data.apiCallFlag) {
                    this.getCategoryValue();
                }
            });
    }
    openEditAddonDialog(id) {
        const selectedValue = this.addOnGroup.at(id).get("addOnGroupId").value;
        if (selectedValue) {
            const choiceDetail = this.addOnsList.find((data) => {
                return data._id === selectedValue;
            });
            if (choiceDetail) {
                let dialogRef = this.dialog
                    .open(AddAddOnDialogComponent, {
                        disableClose: true,
                        panelClass: "app-full-order-dialog",
                        minWidth: "70%",
                        data: {
                            ...choiceDetail,
                            editFlag: true,
                        },
                    })
                    .afterClosed()
                    .subscribe((data) => {
                        if (data && data.apiCallFlag) {
                            this.getCategoryValue();
                        }
                    });
            }
        }
    }
    addDish() {
        this.showErrorImageFlag = false;

        this.dishesForm.markAllAsTouched();
        //if (!this.base64) {
        //this.showErrorImageFlag = true;
        //}
        //if (!this.dishesForm.valid || !this.base64) {
        //  return;
        //}

        this.myStepper.next();
        // this.restaurantService.addDish(data).subscribe({
        //   next: (res) => {},
        // });
    }
    saveDish() {
        const variantData = this.variants.value.map((data, i) => {
            if (i === this.variantsForm.get("defaultSize").value) {
                this.dishesForm.get("dishPrice").setValue(data.price);
                return {
                    ...data,
                    defaultSize: true,
                };
            } else {
                return {
                    ...data,
                    defaultSize: false,
                };
            }
        });

        const data = {
            ...this.dishesForm.value,
            imageUrl: this.base64,
            sizeAvailabe: variantData,
            addOns: this.addOnGroup.value,
            choicesAvailable: this.choicesGroup.value,
        };
        if (!this.editFlag) {
            this.restaurantService.addDish(data).subscribe({
                next: (res) => {
                    this.restaurantService.setRestaurantData(res);
                    this.router.navigateByUrl("/admin/dishes/view-dish");
                },
            });
        } else {
            const dishData = this.restaurantService.getSelectedDish();
            data["dishId"] = dishData["_id"];
            data["previousDishCategory"] = dishData["categoryId"];

            this.restaurantService.editDish(data).subscribe({
                next: (res) => {
                    this.restaurantService.setRestaurantData(res);
                    this.router.navigateByUrl("/admin/dishes/view-dish");
                },
            });
        }
    }
    checkForSizeAvailable(sizeAvailabe, size) {
        for (let data of sizeAvailabe) {
            if (data.size === size) {
                return true;
            }
        }
        return false;
    }
    openChoicesDialog() {
        let dialogRef = this.dialog
            .open(AddOtherOptionDialogComponent, {
                disableClose: true,
                panelClass: "app-full-order-dialog",
                minWidth: "70%",
            })
            .afterClosed()
            .subscribe((data) => {
                console.log("heeo");

                if (data && data.apiCallFlag) {
                    this.getCategoryValue();
                }
            });
    }
    openEditDishChoicesDialog(id) {
        const selectedValue = this.choicesGroup.at(id).get("choicesId").value;
        if (selectedValue) {
            const choiceDetail = this.dishChoicesList.find((data) => {
                return data._id === selectedValue;
            });
            if (choiceDetail) {
                let dialogRef = this.dialog
                    .open(AddOtherOptionDialogComponent, {
                        disableClose: true,
                        panelClass: "app-full-order-dialog",
                        minWidth: "70%",
                        data: {
                            editFlag: true,
                            ...choiceDetail,
                        },
                    })
                    .afterClosed()
                    .subscribe((data) => {
                        if (data && data.apiCallFlag) {
                            this.getCategoryValue();
                        }
                    });
            }
        }
    }

    selectionChange(event) {
        if (event.selectedIndex === 2) {
            this.sizesAvailable = [{ size: "All" }, ...this.variants.value];
            const addonData = this.addOnGroup.value;
            if (addonData && addonData.length) {
                for (let [index, data] of addonData.entries()) {
                    if (
                        data.size &&
                        data.size !== "All" &&
                        !this.checkForSizeAvailable(
                            this.sizesAvailable,
                            data.size
                        )
                    ) {
                        this.addOnGroup
                            .get(String(index))
                            .get("size")
                            .patchValue("");
                    }
                }
            }
        }
    }
    checkaddVaraiantDependecy() {
        if (
            this.dishesForm.get("dishName").value &&
            this.dishesForm.get("dishCategory").value
        ) {
            return true;
        }
        return false;
    }
    checkForDefaultSelect() {
        const defaultSize = this.variantsForm.get("defaultSize").value;
        const variantFormLength = this.variantsForm.value?.variants?.length;
        if (variantFormLength === 0) {
            return false;
        }
        if (defaultSize >= variantFormLength) {
            this.utilService.openSnackBar(
                "Please select a default value.",
                true,
                5000
            );
            return true;
        }
        return false;
    }
    addVariantToDish() {
        this.variantsForm.markAllAsTouched();
        if (!this.variants.valid || this.checkForDefaultSelect()) {
            return;
        }
        console.log(this.variantsForm.value);

        this.myStepper.next();
    }
    addAddOnToDish() {
        this.addOnGroupForm.markAllAsTouched();
        if (!this.addOnGroup.valid) {
            return;
        }

        this.myStepper.next();
    }
    checkAddonValues() {
        const addOnData = this.addOnGroup.value;
        if (this.checkForAll(addOnData)) {
            return true;
        }
        return false;
    }

    checkForAll(addOnData: any) {
        let count = 0;
        const sizesStore = [];
        const map = new Map();
        if (addOnData) {
            for (let data of addOnData) {
                if (data.size === "All") {
                    count += 1;
                }
                if (sizesStore.includes(data.size)) {
                    this.utilService.openSnackBar(
                        `The ${data.size} size should only have one addon associated with it, but currently, it has more than one addon assigned.`,
                        true
                    );
                    return true;
                }
                sizesStore.push(data.size);
            }
        }

        if (count >= 1 && addOnData.length > 1) {
            this.utilService.openSnackBar(
                'If you select "All", you can only have one addon!',
                true
            );
            return true;
        }
        return false;
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
    // async imageUpload(event) {
    //     this.selectedFile = event.target.files[0];
    //     this.base64 = await this.convertToBase64(this.selectedFile);

    //     var input = event.srcElement;
    //     var fileName = input.files[0].name;
    //     if (fileName) {
    //         this.fileChooseText = fileName;
    //     }
    // }
    checkForError(fieldName: string, errorString: string) {
        return (
            this.dishesForm.get(fieldName).errors &&
            this.dishesForm.get(fieldName).errors[errorString] &&
            (this.dishesForm.get(fieldName).dirty ||
                this.dishesForm.get(fieldName).touched)
        );
    }
    deleteField(index) {
        this.variants.removeAt(index);
    }
    deleteAddonField(index) {
        this.addOnGroup.removeAt(index);
    }
    deleteDishChoicesField(index) {
        this.choicesGroup.removeAt(index);
    }
    checkForAddonError(name: any, fieldName: string, errorString: string) {
        const id = String(name);

        return (
            this.addOnGroupForm.get("addOnGroup").get(id).get(fieldName)
                .errors &&
            this.addOnGroupForm.get("addOnGroup").get(id).get(fieldName).errors[
                errorString
            ] &&
            (this.addOnGroupForm.get("addOnGroup").get(id).get(fieldName)
                .dirty ||
                this.addOnGroupForm.get("addOnGroup").get(id).get(fieldName)
                    .touched)
        );
    }
    checkForVariantsError(name: any, fieldName: string, errorString: string) {
        const id = String(name);

        return (
            this.variantsForm.get("variants").get(id).get(fieldName).errors &&
            this.variantsForm.get("variants").get(id).get(fieldName).errors[
                errorString
            ] &&
            (this.variantsForm.get("variants").get(id).get(fieldName).dirty ||
                this.variantsForm.get("variants").get(id).get(fieldName)
                    .touched)
        );
    }
    checkForChoicesGroupError(
        name: any,
        fieldName: string,
        errorString: string
    ) {
        const id = String(name);

        return (
            this.choicesForm.get("choicesGroup").get(id).get(fieldName)
                .errors &&
            this.choicesForm.get("choicesGroup").get(id).get(fieldName).errors[
                errorString
            ] &&
            (this.choicesForm.get("choicesGroup").get(id).get(fieldName)
                .dirty ||
                this.choicesForm.get("choicesGroup").get(id).get(fieldName)
                    .touched)
        );
    }
    openCategoryDialog() {
        let dialogRef = this.dialog.open(AddCategoryDialogComponent, {
            disableClose: true,
            panelClass: "app-full-bleed-dialog",
            minWidth: "500px",
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.apiCallFlag) {
                this.getCategoryValue();
            }
        });
    }
}
