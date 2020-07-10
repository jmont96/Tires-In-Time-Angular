import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../_services/orders.service';
import { AuthenticationService, AlertService } from '../_services';
import { MatDialog } from '@angular/material';
import { EditOrderComponent } from '../edit-order/edit-order.component'

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {

  orders: any;
  constructor(public dialog: MatDialog, private alert_service: AlertService, private order_service: OrdersService, private auth_service: AuthenticationService) { }

  ngOnInit() {
    if (this.auth_service.currentUserValue['user']._id) {
      this.order_service.get_orders_for_user(this.auth_service.currentUserValue['user']._id).subscribe(x => {
        this.orders = x;
        console.log(x);
      })
    }
  }

  reload_orders() {
    if (this.auth_service.currentUserValue['user']._id) {
      this.order_service.get_orders_for_user(this.auth_service.currentUserValue['user']._id).subscribe(x => {
        this.orders = x;
        console.log(x);
      })
    }
  }

  /** This function opens the big modal that lets the user edit their order */
  open_edit_order_dialog(order) {

    if (Date.parse(order.date + " " + order.time) - new Date().getTime() < 86400000) {
      this.alert_service.subject.next("Cannot update this order since it is in less than 24 hours. Contact support if help is needed. ");
    }
    else {
      const dialogRef = this.dialog.open(EditOrderComponent, {
        data: {
          order_data: order
        }
      });
      dialogRef.afterClosed()
        .subscribe((result: any) => {
          console.log(result);
          if (result == "deleted") {
            this.alert_service.subject.next("Successfully cancelled your order! You will be refunded in full.");
            this.reload_orders();
          }
          else if (result != "deleted" && result != undefined) {
            this.alert_service.subject.next("Successfully updated your order!");
          }
        });
    }

  }

}
