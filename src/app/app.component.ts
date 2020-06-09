import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, AlertService } from './_services';
import { User } from './_models';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tiresInTimeFrontend';
  currentUser: User;
  show_nav = false;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private notificationService: AlertService, 
        private snackBar: MatSnackBar
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
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        this.show_nav = false;
    }
}
