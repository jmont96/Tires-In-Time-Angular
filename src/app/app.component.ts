import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, AlertService } from './_services';
import { User } from './_models';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from '@angular/material'
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tiresInTimeFrontend';
  currentUser: User;
  show_nav = false;
  // Flag for responsive design
  mobile_screen: boolean;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private notificationService: AlertService, 
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private breakpointObserver: BreakpointObserver,
    ) {
        this.authenticationService.currentUser.subscribe(x => {
          this.currentUser = x
          if(x){
            this.show_nav = true;
          }
         
        });
        this.notificationService.subject.subscribe(message => {
          this.snackBar.open(message , 'Dismiss' ,{
            duration: 3000
          });
        });

        breakpointObserver.observe([
          Breakpoints.XSmall,
          Breakpoints.Small
      ]).subscribe(result => {
          this.mobile_screen = result.matches;
      });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        this.show_nav = false;
    }
    open_register_dialog(){
      const authDialog = this.dialog.open(AuthDialogComponent, {

      });
      authDialog.afterClosed()
          .subscribe((result: any) => {
              console.log("closed");
          });
    }

    nav_to_orders(){
      this.router.navigate(['/view-orders', this.currentUser['user']._id])
    }
}
