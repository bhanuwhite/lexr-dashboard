import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as coorddata from '../../../assets/coordinate.json';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  step: number = 2;
  visibleSidebar1!: boolean;
  items: any;
  public TechCat: any;
  data: any;
  cities: any[] = [];
selectedCity: any;

  ngOnInit() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56],
          borderColor: '#FF9F1C',
          borderWidth: 2,
        },
        {
          label: 'My Second Dataset',
          data: [40, 48, 62, 70, 45],
          borderColor: 'grey', // Grey color
          borderWidth: 2,
      },
      ],
      
    };
    this.cities = [
      { name: 'All Category', code: 'NY' },
      { name: 'Los Angeles', code: 'LA' },
      { name: 'Chicago', code: 'CH' },
      // Add more cities as needed
  ];
  }

}










