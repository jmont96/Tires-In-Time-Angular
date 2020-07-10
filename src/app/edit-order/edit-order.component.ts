import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { MapboxService } from '../_services/mapbox.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OrdersService } from '../_services/orders.service'


@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  address_chosen_successfully: boolean;
  address_error: boolean;
  extra_info_form: FormGroup;
  allow_edit_confirm: boolean;
  times_available = [];
  time_options = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];
  old_date = "";
  old_time = "";
  old_address = "";
  delete_clicked = false;

  constructor(
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private order_data: any,
    private mapbox: MapboxService,
    private order_service: OrdersService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.mapbox.updateMarker(this.order_data.order_data.location["latitude"], this.order_data.order_data.location["longitude"]);

    this.old_date = this.order_data.order_data.date;
    this.old_time = this.order_data.order_data.time;
    this.old_address = this.order_data.order_data.address;

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 200)
    console.log(this.order_data);

    this.extra_info_form = this.fb.group({

      address: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required])
    })

    this.extra_info_form.controls.address.setValue(this.old_address);
    this.extra_info_form.controls.date.setValue(this.old_date);
    this.extra_info_form.controls.time.setValue(this.old_time);

    this.extra_info_form.valueChanges.subscribe(x => {

      this.order_data.order_data.color = x.color;
      if (x.date !== "") {
        const date_arr = x.date.toString().split(' ');
        this.order_data.order_data.date = date_arr[0] + " " + date_arr[1] + " " + date_arr[2];
        this.order_service.get_orders_on_date(this.order_data.order_data.date).subscribe(result => {
          this.times_available = this.time_options.filter(time => !result.includes(time))
        })
      }

      this.order_data.order_data.license = x.license_number;

      this.order_data.order_data.time = x.time

      if (x.date != "" && x.color != "" && x.time != "" && x.address.length > 10 && this.address_chosen_successfully && x.license_number != "") {
        this.allow_edit_confirm = true;
      }

    });
  }

  /** Confirms that the user has selected an address and saves it to the order */
  onAutocompleteSelected(event: Event) {
    this.order_data.order_data.address = event['formatted_address'];

    if (this.extra_info_form.status == "VALID") {

    }
  }
  /** Updates the map marker with the user's selected address */
  onLocationSelected(event: Event) {

    this.mapbox.updateMarker(event["latitude"], event["longitude"]);
    this.mapbox.get_distance_between_cordinates({
      latitude: event['latitude'],
      longitude: event["longitude"]
    }).subscribe(x => {

      if ((x.routes[0].distance / 1609) <= 45) {
        this.address_chosen_successfully = true;
        this.order_data.order_data.location = {
          latitude: event['latitude'],
          longitude: event["longitude"]
        }
        this.address_error = false;
      }
      else {
        this.address_chosen_successfully = false;
        this.address_error = true;
      }

    })

  }

  reveal_delete(){
    
    this.delete_clicked = true;
  }

  update_and_close() {
    this.order_service.updateOrder(this.order_data.order_data._id, {
      address: this.order_data.order_data.address,
      date: this.order_data.order_data.date,
      time: this.order_data.order_data.time,
      location: this.order_data.order_data.location
    }).subscribe(x => {
      this.close_with_data();
    })
  }

  delete_and_close() {
    this.order_service.delete(this.order_data.order_data._id).subscribe(x => {
      this.dialogRef.close("deleted");
    })
  }

  close() {
    this.order_data.order_data.address = this.old_address;
    this.order_data.order_data.date = this.old_date;
    this.order_data.order_data.time = this.old_time;
    this.dialogRef.close();
  }
  close_with_data() {
    this.dialogRef.close(this.order_data);
  }

}
