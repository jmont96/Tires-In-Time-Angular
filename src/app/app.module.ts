import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { appRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule} from '@angular/material/form-field';
import { AlertComponent } from './_components';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MapComponent } from './map/map.component';
import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule, MatList} from '@angular/material/list';
import { TireSizeDialogComponent } from './tire-size-dialog/tire-size-dialog.component';
import { MainFormComponent } from './main-form/main-form.component';
import { FormPageComponent } from './form-page/form-page.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { NgxStripeModule } from 'ngx-stripe';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AlertComponent,
    MapComponent,
    TireSizeDialogComponent,
    MainFormComponent,
    FormPageComponent,
    PaymentDialogComponent
    
  ],
  imports: [
    BrowserModule,
    NgxStripeModule.forRoot('pk_test_51Gs9jdCadmyi3VDDENyHq5nwJASlV6kgWy8zLMoJGTsbtfS55ObOO4Hds2hxychF4kubQhWR7LrXVRyVOis1qiEV00zmPqQ6a0'),
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatToolbarModule,
    appRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    MatDialogModule,
    MatProgressBarModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatListModule,
    MatGoogleMapsAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDXX7daiIIHhbpdsFIxvziMRiQ9Z8yghgQ',
      libraries: ['places']
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    MatDatepickerModule,
  ],
  entryComponents: [TireSizeDialogComponent, PaymentDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
