import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import 'mapbox-gl/dist/mapbox-gl.css';
import { User } from '../_models';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { VehicleService } from '../_services/vehicles.service';
import { TireService } from '../_services/tires.service';
import { OrdersService } from '../_services/orders.service';
import { FormBuilder, FormGroup, Validators, FormControl, Form, ValidatorFn, AbstractControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MapboxService } from '../_services/mapbox.service';
import { lengthValidator } from './validators';
import { MatDialog } from '@angular/material';
import { TireSizeDialogComponent } from '../tire-size-dialog/tire-size-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component'
import { options } from '../_helpers/options_variables';
import { MatStepper } from '@angular/material/stepper';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component'
import { TireInfoDialogComponent } from '../tire-info-dialog/tire-info-dialog.component';


@Component({
    selector: 'app-main-form',
    templateUrl: './main-form.component.html',
    styleUrls: ['./main-form.component.css']
})
export class MainFormComponent implements OnInit {

    @ViewChild('stepper', null) private myStepper: MatStepper;
    currentUser: User;

    // Obj representing final results of form
    final_order = {
        make: "",
        model: "",
        size: "",
        color: "",
        license: "",
        address: "",
        date: "",
        time: "",
        amount: 0,
        tire: "",
        choices: [],
        user_email: "",
        user_id: "",
        location: {}
    };


    // Form Groups
    make_year_form: FormGroup;
    model_form: FormGroup;
    //trim_form: FormGroup;
    type_form: FormGroup;
    extra_info_form: FormGroup;
    tire_size_form: FormGroup;
    tire_choice_form: FormGroup;
    tire_form: FormGroup;

    // Flags for disables
    other_amount_selected = true;
    amount_matches_choice = true;
    show_extra_makes_button = true;
    address_chosen_successfully = false;

    // Flag for responsive design
    mobile_screen: boolean;

    // Arrays filled by REST API calls
    model_options = [];
    trim_options = [];
    make_options = [];
    extra_make_options = [];
    tire_size_options = [];
    tires_options = {
        rb: false,
        rf: false,
        lf: false,
        lb: false
    }

    tire_options = [];
    tire_result_set = [];
    tire_type_filters = [];
    times_available = [];

    // Pre determined option arrays for colors and such 
    color_options = options.colors;
    type_options = options.types;
    time_options = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];
    tire_amount_options = options.amounts;

    // Var represnting progress through the form
    progress_value = 10;

    // Arary for final confirmation page
    final_page_array = [];

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private vehicleService: VehicleService,
        private fb: FormBuilder,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private alertService: AlertService,
        private mapbox: MapboxService,
        public dialog: MatDialog,
        private tire_service: TireService,
        private order_service: OrdersService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;

        breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small
        ]).subscribe(result => {
            this.mobile_screen = result.matches;
        });
    }

    ngOnInit() {
        this.adjustScreen();
        this.getMakeOptions();
        this.initForms();
        this.initListeners();
    }






    /********************************  HELPER FUNCTIONS  ******************************* */

    /** Filters the tire options based on available types... cool! */
    filter_by_type(type) {
        if (type === "ALL") {
            this.tire_options = this.tire_result_set;
            return;
        }
        this.tire_options = [];
        this.tire_result_set.forEach(tire => {
            if (tire.type === type) {
                this.tire_options.push(tire);
            }
        })
    }

    /** Launches the payment dialog and inits stripe... but first! We need to sign the user in */
    go_to_payment() {
        if (this.authenticationService.currentUserValue) {
            this.final_order.user_email = this.authenticationService.currentUserValue['user'].email;
            this.final_order.user_id = this.authenticationService.currentUserValue['user']._id;
            this.open_payment_dialog()
        }
        else {
            const authDialog = this.dialog.open(AuthDialogComponent, {

            });
            authDialog.afterClosed()
                .subscribe((result: any) => {
                    this.final_order.user_email = result.email;
                    if (result.email.value) {
                        this.final_order.user_email = result.email['value']
                    }
                    if (result._id == undefined) {
                        this.final_order.user_id = ""
                    }
                    else {
                        this.final_order.user_id = result._id;
                    }

                    this.open_payment_dialog()
                });
        }
    }

    /** Opens the big modal for payment */
    open_payment_dialog() {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            // opening dialog here which will give us back stripeToken
            data: {
                order: this.final_order,
            }
        });
        dialogRef.afterClosed()
            // waiting for stripe token that will be given back
            .subscribe((result: any) => {
                if (result) {

                }
            });
    }

    /** This function opens the big modal that helps a user understand how to read their tires */
    open_tire_info_dialog(tire) {
        const dialogRef = this.dialog.open(TireInfoDialogComponent, {
            data: {
                tire_data: tire
            }
        });
        dialogRef.afterClosed()
            .subscribe((result: any) => {
                this.final_order.tire = result;
                if (result && result._id) {
                    this.goForward();
                }
            });
    }

    /** Constructs an array that we use on the final page. Makes our HTML life a little easier */
    constructFinalPageArray() {

        this.progress_value = 100;
        
        const keys = Object.keys(this.final_order);
        const values = Object.values(this.final_order);
        console.log(values)
        const icons = options.icons;
        this.final_page_array = [];

        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != 'tire' && keys[i] != "user_email" && keys[i] != "user_id" && keys[i] != "location") {
                const obj = {
                    key: keys[i],
                    val: values[i],
                    icon: icons[i]
                }
                this.final_page_array.push(obj);
            }
        }
        this.final_page_array.push({
            key: "tire",
            val: this.final_order.tire['article_desc'],
            icon: "drive_eta"
        })
    }

    /** This function fixes a bug where some styles were stuck before screen adjust */
    adjustScreen() {
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"))
        }, 200)
    }

    /** Make a call to the DB and get all of the possible Make options */
    private getMakeOptions() {
        this.vehicleService.getMakeBrands()
            .pipe(first())
            .subscribe(vehicles => {
                vehicles.forEach(car => {
                    if (options.extras.includes(car.toString())) {
                        this.extra_make_options.push(car);
                    }
                    else {
                        this.make_options.push(car);
                    }
                })
            });
    }

    /** If the user doesn't see their make option, then we open all the hidden make cards */
    mergeMakeOptions() {
        this.show_extra_makes_button = false;
        this.extra_make_options.forEach(car => {
            this.make_options.push(car);
        })
    }

    /** Function to open the help dialog */
    openDialog() {
        const dialogRef = this.dialog.open(TireSizeDialogComponent);
        dialogRef.afterClosed().subscribe(result => {

        });
    }

    /** Verifies that the user has selected the correct amount of tires */
    updateMatchCheck() {
        if (this.final_order.choices.length != this.final_order.amount) {
            this.amount_matches_choice = true;
            this.tire_choice_form.controls.hidden_input.enable();
            return false;
        }
        else {
            this.amount_matches_choice = false;
            this.tire_choice_form.controls.hidden_input.disable();

            if (!this.amount_matches_choice) {
                console.log("getting tires")
                this.progress_value = 90;
                this.tire_type_filters = [];
    
                this.tire_service.getTireQuery(this.final_order.size, "", "3036").subscribe(data => {
                    this.tire_options = data;
                    this.tire_result_set = data;
                    this.tire_type_filters.push("ALL");
                    this.tire_options.forEach(element => {
                        if (!this.tire_type_filters.includes(element.type)) {
                            this.tire_type_filters.push(element.type);
                        }
                        if (element.qoh < this.final_order.choices.length) {
                            element['low_stock'] = true;
                        }
                        else {
                            element['low_stock'] = false;
                        }
                    });
                    this.tire_result_set = this.tire_options;
                },
                    error => {
                        console.log(error);
                    })
            }

            return true;
        }
    }
    /** Confirms that the user has selected an address and saves it to the order */
    onAutocompleteSelected(event: Event) {
        this.final_order.address = event['formatted_address'];
        this.address_chosen_successfully = true;

        if(this.extra_info_form.status == "VALID"){
            this.constructFinalPageArray();
        }
    }
    /** Updates the map marker with the user's selected address */
    onLocationSelected(event: Event) {
        console.log("location selected")
        this.mapbox.updateMarker(event["latitude"], event["longitude"]);
        this.final_order.location = {
            latitude: event['latitude'],
            longitude: event["longitude"]
        }
    }

    /** Function to activiate flag for opening more options of tire amount */
    openOtherOptions() {
        this.other_amount_selected = false;
        this.alertService.subject.next("Note: At Tires In Time, we recommend you change 2 OR 4 tires at a time.");
    }

    /** Checks all four tires if they choose '4' */
    check_all_options() {
        this.final_order.choices.length = 0;
        this.tires_options.rb = true;
        this.tires_options.lb = true;
        this.tires_options.rf = true;
        this.tires_options.lf = true;
        this.final_order.choices.push("Right Front");
        this.final_order.choices.push("Right Back");
        this.final_order.choices.push("Left Front");
        this.final_order.choices.push("Left Back");
        this.final_order.amount = 4
        this.updateMatchCheck();
    }

    /** Function that keeps the user's choice of tires up to date in an array */
    updateTireChoice(event: Event, tire: String, change: string) {

        if (event['checked']) {
            this.final_order.choices.push(tire);
        }
        else {
            const index = this.final_order.choices.indexOf(tire);
            if (index > -1) {
                this.final_order.choices.splice(index, 1);
            }
        }
        this.tires_options[change] = !this.tires_options[change];
        this.updateMatchCheck()


       
    }


    /********************************  CONSTRUCTOR FUNCTIONS  ******************************* */

    /** Function to initialize all of our Form Groups in the multistep form */
    initForms() {
        this.make_year_form = this.fb.group({
            make: ['', [Validators.required]]
        })
        this.model_form = this.fb.group({
            model: new FormControl('', [Validators.required]),
        })
        this.extra_info_form = this.fb.group({
            color: new FormControl('', [Validators.required]),
            license_number: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            date: new FormControl('', [Validators.required]),
            time: new FormControl('', [Validators.required])
        })
        this.tire_size_form = this.fb.group({
            width: new FormControl('', [Validators.required]),
            ratio: new FormControl('', [Validators.required]),
            rim: new FormControl('', [Validators.required]),
        })
        this.tire_choice_form = this.fb.group({
            tire_amount: new FormControl('', [Validators.required]),
            hidden_input: new FormControl('', [Validators.required])
        });
        this.tire_form = this.fb.group({
            tire_id_selection: new FormControl('', []),
        });

    }



    /** Function to init our listeners for value change events */
    initListeners() {

        this.make_year_form.valueChanges.subscribe(x => {
            if (x['make'] != "") {
                this.final_order.make = x.make;

                this.vehicleService.getModelOptions(this.final_order.make).pipe(first())
                    .subscribe(
                        data => {
                            this.model_options = data;
                            this.progress_value = 20;
                        },
                        error => {
                            this.alertService.subject.next("Something went wrong...");
                        });
                this.goForward();

            }
        })
        this.model_form.valueChanges.subscribe(x => {
            if (x['model'] != "") {
                this.final_order.model = x.model;
                this.goForward();
            }
        })

        this.tire_size_form.valueChanges.subscribe(x => {
            this.final_order.size = x.width + "/" + x.ratio + "R" + x.rim
            console.log(this.final_order.size)
        })

        this.tire_choice_form.controls.tire_amount.valueChanges.subscribe(x => {
            console.log(x);
            if (x === 4) {
                this.check_all_options()
            }
            else {
                this.final_order.amount = Number(x);
                this.updateMatchCheck();
            }

            console.log(!this.amount_matches_choice)

            
        })

        this.tire_form.valueChanges.subscribe(x => {
            this.final_order.tire = x.tire_id_selection;
        });

        this.extra_info_form.valueChanges.subscribe(x => {
            console.log(x);
            this.final_order.color = x.color;
            if (x.date !== "") {
                const date_arr = x.date.toString().split(' ');
                this.final_order.date = date_arr[0] + " " + date_arr[1] + " " + date_arr[2];
                this.order_service.get_orders_on_date(this.final_order.date).subscribe(result => {
                    this.times_available = this.time_options.filter(time => !result.includes(time))
                })
            }

            this.final_order.license = x.license_number;
        
            this.final_order.time = x.time

            if(x.date != "" && x.color != "" && x.time != "" && x.address.length > 10 && this.address_chosen_successfully && x.license_number != ""){
                this.constructFinalPageArray();
            }
            
        });
    }

    /********************************  FORM SUBMIT FUNCTIONS  ******************************* */

    onSubmitMake(event: Event) {
        // this.final_order.make = this.make_year_form.controls['make'].value;

        // this.vehicleService.getModelOptions(this.final_order.make).pipe(first())
        //     .subscribe(
        //         data => {
        //             this.model_options = data;
        //             this.progress_value = 20;
        //         },
        //         error => {
        //             this.alertService.subject.next("Something went wrong...");
        //         });
    }

    onSubmitModel(event: Event) {
        //this.final_order.model = this.model_form.controls['model'].value
    }


    onSubmitSize(event: Event) {
        // this.progress_value = 65;
        // this.final_order.size = this.tire_size_form.controls.width.value + "/" + this.tire_size_form.controls.ratio.value + "R" + this.tire_size_form.controls.rim.value
    }

    onSubmitChoice(event: Event) {
        // this.progress_value = 90;

        // this.tire_service.getTireQuery(this.final_order.size, "", "3036").subscribe(data => {
        //     this.tire_options = data;
        //     this.tire_result_set = data;
        //     this.tire_type_filters.push("ALL");
        //     this.tire_options.forEach(element => {
        //         if (!this.tire_type_filters.includes(element.type)) {
        //             this.tire_type_filters.push(element.type);
        //         }
        //         if (element.qoh < this.final_order.choices.length) {
        //             element['low_stock'] = true;
        //         }
        //         else {
        //             element['low_stock'] = false;
        //         }
        //     });
        //     this.tire_result_set = this.tire_options;
        // },
        //     error => {
        //         console.log(error);
        //     })
    }

    onSubmitTires(event: Event) {
        this.progress_value = 90;
    }

    onSubmitExtra(event: Event) {
       
        // this.progress_value = 100;
        // this.final_order.license = this.extra_info_form.controls['license_number'].value;
        // const date_arr = this.extra_info_form.controls['date'].value.toString().split(' ');
        // this.final_order.date = date_arr[0] + " " + date_arr[1] + " " + date_arr[2];
        // this.final_order.time = this.extra_info_form.controls['time'].value

        //this.constructFinalPageArray()
    }

    /** Functions to control the stepper */
    goBack() {
        this.myStepper.previous();
    }

    goForward() {
        this.myStepper.next();
    }


}


