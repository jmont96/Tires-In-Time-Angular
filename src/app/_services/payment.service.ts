import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    constructor(private http: HttpClient) { }

    confirmPayment(data) {
       console.log(data);
        return this.http.post(`${environment.apiUrl}/payments/create_charge`, data)
    }

    getCostAfterMarkup(price) {
        return this.http.post(`${environment.apiUrl}/payments/get_final_price`, { price: price });
    }

}