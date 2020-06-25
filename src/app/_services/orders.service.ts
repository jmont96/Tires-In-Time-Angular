import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    constructor(private http: HttpClient) { }

    getAll() {
        console.log("Get All")
        return this.http.get<any>(`${environment.apiUrl}/users`);
    }

    get_orders_for_user(id) {
        return this.http.get<any>(`${environment.apiUrl}/orders/get-for-user/${id}`);
    }

    get_orders_on_date(date) {
        return this.http.get<String[]>(`${environment.apiUrl}/orders/get-orders-on-date/${date}`);
    }

    createOrder(order) {
        console.log("Create Order")
        console.log(order)
        return this.http.post(`${environment.apiUrl}/orders/create`, order).subscribe((x) => { 
            console.log(x);
            console.log("we did it!");
        });
       
    }

    updateOrder(id, body) {
        console.log("Update Order")
        return this.http.put(`${environment.apiUrl}/orders/${id}`, body);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/orders/${id}`);
    }
}