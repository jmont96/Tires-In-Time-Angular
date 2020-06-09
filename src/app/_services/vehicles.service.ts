import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class VehicleService {
    constructor(private http: HttpClient) { }

    getModelOptions(make, year) {
        console.log(make);
        console.log(year);
        return this.http.get<String[]>(`${environment.apiUrl}/vehicles/get-model-options?make=${make}&year=${year}`);
    }

    getTrimOptions(make, model, year) {
        return this.http.get<String[]>(`${environment.apiUrl}/vehicles/get-trim-options?make=${make}&model=${model}&year=${year}`);
    }

    getTireSize(make, model, year, trim) {
        return this.http.get<String[]>(`${environment.apiUrl}/vehicles/get-tire-options?make=${make}&model=${model}&year=${year}&trim=${trim}`);
    }

    getMakeBrands() {
        return this.http.get<String[]>(`${environment.apiUrl}/vehicles/get-make-brands`);
    }

}