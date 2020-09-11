import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';





@Component({ 
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    
    // Flag for responsive design
    mobile_screen: boolean;

    constructor(router: Router, private breakpointObserver: BreakpointObserver,){
        breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small
        ]).subscribe(result => {
            this.mobile_screen = result.matches;
        });
    }

    ngOnInit(){
        
    } 

    nav_to_home(){
       
    }
}

