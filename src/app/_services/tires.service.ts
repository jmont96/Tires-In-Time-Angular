import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TireService {
    constructor(private http: HttpClient) { }

    getTireQuery(size: String, type: String, warehouse_num: String) {
        if (type !== "") {
            return this.http.get<any>(`${environment.apiUrl}/tires/?size=${size}&warehouse_num=${warehouse_num}`);
        }
        else {
            return this.http.get<any>(`${environment.apiUrl}/tires/?size=${size}&warehouse_num=${warehouse_num}&type=${type}`);
        }
    }

    updateTireQOH(id: String, warehouse_num: String, quanity: String) {
        console.log("called update QOH")
        return this.http.put(`${environment.apiUrl}/tires/${id}`,  { warehouse_num: warehouse_num, quantity: quanity });
    }

    getByID(id: number, warehouse_num: String) {
        return this.http.get(`${environment.apiUrl}/tires/${id}?warehouse_num=${warehouse_num}`);
    }
}