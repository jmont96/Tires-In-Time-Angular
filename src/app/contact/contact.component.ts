import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor( private fb: FormBuilder ) { }

  contact_form: FormGroup;

  ngOnInit() {

    this.contact_form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.email, Validators.required]],
      message: ['', [Validators.required]]
    })

  }

  onSubmitContactForm() {
    console.log("woo")
  }


}
