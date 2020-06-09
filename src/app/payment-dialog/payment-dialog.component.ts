import { Component, OnInit, Inject } from '@angular/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material'
import { PaymentService } from '../_services/payment.service'
import { AlertService } from '../_services/alert.service'


@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  elements: Elements;
  card: StripeElement;

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private order_data: any,
    private payment_service: PaymentService,
    private alert_service: AlertService,
    private stripeService: StripeService) { }

  ngOnInit() {
    console.log(this.order_data)
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      address_city: ['', [Validators.required]],
      address_country: ['', [Validators.required]],
      address_line1: ['', [Validators.required]],
      address_line2: ['', []],
      address_state: ['', [Validators.required]]


    });
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#a30c0c',
                color: '#071108',
                fontSize: '18px',
                '::placeholder': {
                  color: '#a6a6a6'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }

  buy() {
    const name = this.stripeTest.get('name').value;
    const add1 = this.stripeTest.get('address_line1').value;
    const city = this.stripeTest.get('address_city').value;
    const state = this.stripeTest.get('address_state').value;
    const country = this.stripeTest.get('address_country').value;
    const add2 = this.stripeTest.get('address_line2').value;
    this.stripeService
      .createToken(this.card, {
        name: name,
        address_city: city,
        address_line1: add1,
        address_country: country,
        address_line2: add2,
        address_state: state
      })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token);
          this.order_data.order['status'] = "active";
          this.order_data.order['timestamp'] = new Date().toJSON();
          this.order_data.order['payment'] = '************' + result.token.card.last4;
          this.order_data.order['payment_id'] = '************' + result.token.card.last4;
          this.order_data.order['payment_type'] = result.token.card.funding;

          const final_obj = {
            order: this.order_data.order,
            token: result.token.id
          }
          console.log("yeet")
          this.payment_service.confirmPayment(final_obj).subscribe((x:any) => {
            console.log(x);
            this.alert_service.subject.next(x.message);
          });
        } else if (result.error) {
          // Error creating the token
          console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
          console.log(result.error.message);
        }
      });
  }
}