import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { GeoJson } from '../_models/GeoJson';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  map: mapboxgl.Map;
  style = "mapbox://styles/jmont96/ck9m0rp9v13zq1iqq9oeo8roa";
  lat = 13.0569951;
  lng = 80.20929129999999;
  location_observer;
  message = 'Hello World!';
  constructor() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.location_observer = new Subject<Number>();
  }

  getMarkers() {
    const g = new GeoJson([this.lng, this.lat], {
      'message': 'Selected Location'
    })
    return [g];
  }

  updateMarker(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    console.log("Updated markers");
    this.location_observer.next({
      "data": this.getMarkers(),
      "lat": this.lat,
      "lng": this.lng
    });
  }


  createMarker() {

  }

  removeMarker() {

  }

}
