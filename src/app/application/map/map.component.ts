import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as coorddata from '../../../assets/coordinate.json';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  coordinatesPoint: any = [85.839452, 20.260296];
  map: any = {};
  tempData: any = (coorddata as any).default;
  style = 'mapbox://styles/mapbox/streets-v12';
  zoom: number = 15;
  constructor() {
    mapboxgl!.accessToken = environment.mapbox.accessToken;
  }
  ngOnInit(): void {
    this.mapBox();
  }
  mapBox() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.coordinatesPoint[0], this.coordinatesPoint[1]],
    });
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    // Add markers to the map.
    for (const marker of this.tempData.features) {
      // Create a DOM element for each marker.
      const el = document.createElement('div');
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      el.className = 'marker';
      el.style.backgroundImage = `url(${marker.properties.image})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';
      el.addEventListener('mouseenter', () => {
        // window.alert(marker.properties.message);
        popup
          .setLngLat(marker.geometry.coordinates)
          .setHTML(marker.properties.message)
          .addTo(this.map);
      });
      el.addEventListener('mouseleave', () => {
        // window.alert(marker.properties.message);
        popup.remove();
      });
      // Add markers to the map.
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(this.map);
    }
    // new mapboxgl.Marker(el)
    new mapboxgl.Marker()
      .setLngLat([this.coordinatesPoint[0], this.coordinatesPoint[1]])
      .addTo(this.map);
  }
}
