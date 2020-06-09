import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { MapboxService } from '../_services/mapbox.service'
import { GeoJson, FeatureCollection } from '../_models/GeoJson';
import * as mapboxgl from 'mapbox-gl';
import { Geometry } from '@agm/core/services/google-maps-types';


@Component({
    selector: 'map-box',
    templateUrl: 'map.component.html'
})
export class MapComponent implements OnInit, AfterViewInit {

    @ViewChild('map', null) map_child: any;

    map: mapboxgl.Map;
    style = 'mapbox://styles/jmont96/ck9mvhbkb0gyw1io7qfquw253';
    lat = 37;
    lng = -122;
    message = "Selected Location";

    source: any;
    markers: any;


    constructor(private mapService: MapboxService) {
    }

    ngOnInit() {
        this.markers =  this.mapService.getMarkers();
        this.initializeMap();
    }

    ngAfterViewInit() {

    }

    private initializeMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.map.flyTo({
                    center: [this.lng, this.lat]
                })
            })
        }

        this.buildMap()
    }

    buildMap() {
        this.map = new mapboxgl.Map({
            container: this.map_child.nativeElement,
            style: this.style,
            zoom: 13,
            center: [this.lng, this.lat]
        })

        this.map.addControl(new mapboxgl.NavigationControl());

        this.map.on('load', (event) => {

            this.map.addSource('customMarker', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            const source: mapboxgl.GeoJSONSource = this.map.getSource('customMarker') as mapboxgl.GeoJSONSource;
            let data:any = new FeatureCollection(this.markers)
            source.setData(data);

            this.mapService.location_observer.subscribe(markers => {
                let data:any = new FeatureCollection(markers.data)
                source.setData(data);
                this.map.flyTo({
                    center: [markers.lng, markers.lat]
                })
            })
           
            
            this.map.addLayer({
                id: 'customMarketid',
                source: 'customMarker',
                type: 'symbol',
                layout: {
                    'text-field': '{message}',
                    'text-size': 16,
                    'text-transform': 'uppercase',
                    'icon-image': 'car-15',
                    'text-offset': [0, 1.5],
                    
                }
            });
        })
    }
}

