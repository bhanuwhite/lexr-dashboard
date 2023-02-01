import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as coorddata from '../../../assets/coordinate.json';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  stateOptions = [
    { label: 'Map', value: 'Map' },
    { label: 'List', value: 'List' },
  ];

  ngOnInit() {}
}
