import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../_services/orders.service';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {

  orders: any;
  constructor(private order_service: OrdersService, private auth_service: AuthenticationService) { }

  ngOnInit() {
    if(this.auth_service.currentUserValue['user']._id){
      this.order_service.get_orders_for_user(this.auth_service.currentUserValue['user']._id).subscribe(x => {
        this.orders = x;
        console.log(x);
      })
    }
  }

}
