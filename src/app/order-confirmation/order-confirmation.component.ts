import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {

  sub: any;
  order_data: any;
  currentUser:any;
  
  constructor(private route: ActivatedRoute, private router: Router, private auth_service: AuthenticationService) { }

  ngOnInit() {
    this.order_data = JSON.parse(this.route.snapshot.queryParamMap.get('data'));
    this.currentUser = this.auth_service.currentUserValue['user'];
    console.log(this.auth_service.currentUserValue['user'])
  }

  nav_to_orders(){
    this.router.navigate(['/view-orders', this.currentUser._id])
  }
}
