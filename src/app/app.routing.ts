import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { MainFormComponent } from './main-form/main-form.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'schedule-form', component: MainFormComponent },
    { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
    { path: 'view-orders/:id', component: UserOrdersComponent, canActivate: [AuthGuard]},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);