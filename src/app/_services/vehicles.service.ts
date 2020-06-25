import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class VehicleService {
    constructor(private http: HttpClient) { }

    getModelOptions(make) {
        return this.http.get<String[]>(`${environment.apiUrl}/vehicles/get-model-options?make=${make}`);
    }

    // getTireSize(make, model, year, trim) {
    //     return this.http.get<String[]>(`${environment.apiUrl}/vehicles/get-tire-options?make=${make}&model=${model}&year=${year}&trim=${trim}`);
    // }

    getMakeBrands() {
        return this.http.get<String[]>(`${environment.apiUrl}/vehicles/get-make-brands`);
    }

}