import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';





@Component({ 
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(router: Router){

    }
    ngOnInit(){

    } 

    nav_to_home(){
       
    }
}

