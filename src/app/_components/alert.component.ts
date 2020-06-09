import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../_services';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;
    snackbar: MatSnackBar;

    constructor() { }

    ngOnInit() {
       
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }
}