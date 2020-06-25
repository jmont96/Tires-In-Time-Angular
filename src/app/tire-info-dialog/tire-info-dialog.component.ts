import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-tire-info-dialog',
  templateUrl: './tire-info-dialog.component.html',
  styleUrls: ['./tire-info-dialog.component.css']
})
export class TireInfoDialogComponent implements OnInit {

  diameter: "";
  width: "";
  ratio: "";
  speed: any;
  load: "";
  speed_desc: any;
  constructor(
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private tire_data: any,
  ) { }

  ngOnInit() {
    console.log(this.tire_data)
    console.log(this.tire_data.tire_data.article_desc)

    this.construct_vars();
  }

  construct_vars() {
    this.width = this.tire_data.tire_data.width;
    this.diameter = this.tire_data.tire_data.size_num;
    this.ratio = this.tire_data.tire_data.ratio;
    let tire_size = this.tire_data.tire_data.size;
    if (tire_size[0] === 'P') {
      tire_size = tire_size.substring(1, tire_size.length);
    }
    const tire_arr = tire_size.split(" ");
    this.load = tire_arr[1].substring(0, tire_arr[1].length - 1);
    this.speed = tire_arr[1].substring(tire_arr[1].length - 1, tire_arr[1].length);
    switch (this.speed) {
      case "S":
        this.speed_desc = "112 mph";
        break;
      case 'T':
        this.speed_desc = "118 mph";
        break;
      case 'U':
        this.speed_desc = "124 mph";
        break;
      case 'H':
        this.speed_desc = "130 mph";
        break;
      case 'V':
        this.speed_desc = "149 mph";
        break;
      case 'Z':
        this.speed_desc = "168 mph";
        break;
      case 'W':
        this.speed_desc = "168 mph";
        break;
      case 'Y':
        this.speed_desc = "186 mph";
        break;
      default:
        this.speed_desc = "112 mph";
    }
  }

  close_and_select(){
    this.close_with_data();
  }

  close() {
    this.dialogRef.close();
  }
  close_with_data(){
    this.dialogRef.close(this.tire_data.tire_data);
  }

}
