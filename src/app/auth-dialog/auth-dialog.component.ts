import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AlertService } from '../_services';
import { first } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';
import { UserService } from '../_services/user.service'

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent implements OnInit {

  loginForm: FormGroup;
  guest_form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  registerForm: FormGroup;
  loginPage = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private userService: UserService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.guest_form = this.formBuilder.group({
      email: ['', [Validators.required]],
    });

    this.registerForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  showLogin() {
    this.loginPage = true;
  }

  showRegister() {
    this.loginPage = false;
  }

  close(data) {
    this.dialogRef.close(data);
  }

  // convenience getter for easy access to form fields
  get f_login() { return this.loginForm.controls; }
  get f_guest() { return this.guest_form.controls; }
  
  onSubmitGuest(){
    this.close({ email: this.guest_form.controls.email });
  }

  onSubmitLogin() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f_login.email.value, this.f_login.password.value)
      .pipe(first())
      .subscribe(
        data => {
          //this.router.navigate([this.returnUrl]);
          this.alertService.subject.next("Welcome back, " + data.user.firstName);
          this.close(data.user);
          this.loading = false;
        },
        error => {
          this.alertService.subject.next("Invalid Login Credentials");
          this.loading = false;
        });
  }
  // convenience getter for easy access to form fields
  get f_register() { return this.registerForm.controls; }

  onSubmitRegister() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.authenticationService.login(this.f_register.email.value, this.f_register.password.value)
            .pipe(first())
            .subscribe(
              data => {
                this.alertService.subject.next("Thanks for signing up, " + data.user.firstName + "!");
                this.close(data.user);
                this.loading = false;
              },
              error => {
                this.alertService.subject.next("Invalid Login Credentials");
                this.loading = false;
              });
        },
        error => {
          this.alertService.subject.next(error);
          this.loading = false;
        });
  }

}


