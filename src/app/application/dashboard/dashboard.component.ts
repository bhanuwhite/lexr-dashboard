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
  options: any;

  ngOnInit() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'My First Dataset',
          backgroundColor: ['#FF9F1C'],
          data: [65, 80, 55, 75, 56, 90, 40],
          borderColor: '#FF9F1C',
          borderWidth: 2,
          lineTension: 0.5,
        },
        {
          label: 'My Second Dataset',
          data: [40, 65, 30, 70, 20, 80, 16],
          backgroundColor: ['#c7bebe'],
          borderColor: '#c7bebe', // Grey color
          borderWidth: 2,
          lineTension: 0.5,
        },
      ],

    };
    this.options = {
      scales: {
        x: [
          {
            grid: {
              display: false, // Set to false to hide vertical grid lines
            },
            ticks: {
              font: {
                family: 'RotaBlack',
              },
            },
          },
        ],
        y: [
          {
            ticks: {
              font: {
                family: 'RotaBlack',
              },
            },
          },
        ],
      },
    };
    this.cities = [
      { name: 'All Category', code: 'NY' },
      { name: 'Los Angeles', code: 'LA' },
      { name: 'Chicago', code: 'CH' },
      // Add more cities as needed
    ];
  }

}










