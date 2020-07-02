import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { GeoJson } from '../_models/GeoJson';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


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
  constructor(private http: HttpClient) {
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

  get_distance_between_cordinates(coordinate) {
    const lat = 38.867834
    const lng = -77.072218;

    const lat2 = coordinate.latitude;
    const lng2 = coordinate.longitude;

    return this.http.get<any>('https://api.mapbox.com/directions/v5/mapbox/driving/' + lng + '%2C' + lat + '%3B' + lng2 + '%2C' + lat2 + '?alternatives=false&geometries=geojson&steps=false&access_token=' + environment.mapbox.accessToken);
   
  }

}
