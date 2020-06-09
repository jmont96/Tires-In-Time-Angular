import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '..//_models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any>(`${environment.apiUrl}/tires`);
    }

    getTireQuery(size: String, type: String) {
        return this.http.get<any>(`${environment.apiUrl}/tires/?size=${size}&type=${type}`);
    }

    getByID(id: number) {
        return this.http.get(`${environment.apiUrl}/tires/${id}`);
    }
}