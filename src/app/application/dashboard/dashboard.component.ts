import { Component, OnInit } from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as coorddata from '../../../assets/coordinate.json';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as Papa from 'papaparse';
import { SharedService } from 'src/app/shared.service';

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
  Categories: any[] = [];
  years: any[] = [];
  csvData: any;
  reviewsCount: number = 0;
  uniqueCountries: Set<string> = new Set();
  countryCount: number = 0;
  possitiveCount: number = 0;
  negativeCount: number = 0;
  neutral: number = 0;
  meanSentimentScore: any = 0;
  data1: any[] = [];
  data2: any[] = [];

  // constructor() {}

  constructor(private sharedservice:SharedService,private Route:ActivatedRoute,private http: HttpClient){

    this.Route.data.subscribe((res)=>{
    this.sharedservice.recieveHeaderName(res['name'])
    })

      }

  ngOnInit() {
    this.http
      .get('assets/review_with_sentiments.csv', { responseType: 'text' })
      .subscribe((data) => {
        this.csvData = Papa.parse(data, { header: true }).data;


        let sum = 0;
        for (let i = 0; i < this.csvData.length - 1; i++) {
          if (this.csvData[i].review && this.csvData[i].review.trim() !== '') {
            this.reviewsCount++;
          }

          const sentimentScore = parseFloat(this.csvData[i].sentiment_score);
          if (!isNaN(sentimentScore)) {
            sum += sentimentScore;
          }

          this.meanSentimentScore = (sum / 10).toFixed(2);

          this.uniqueCountries.add(this.csvData[i].country);
          this.countryCount = this.uniqueCountries.size;

          if (this.csvData[i].sentiment_score > 0.6) {
            this.possitiveCount++;
          } else if (this.csvData[i].sentiment_score < 0.4) {
            this.negativeCount++;
          } else {
            this.neutral++;
          }

          if (this.csvData[i].date > '2023-12-31') {
            this.data2.push(Number(this.csvData[i].sentiment_score));
          } else if (this.csvData[i].date < '2023-12-31') {
            this.data1.push(Number(this.csvData[i].sentiment_score));
          }
        }
      });

    this.data = {
      labels: ['01 Jan', '01 Feb', '01 Mar', '01 Apr', '01 May'],
      datasets: [
        {
          label: '2024',
          backgroundColor: ['#FF9F1C'],
          data: this.data2,
          borderColor: '#FF9F1C',
          borderWidth: 1,
          lineTension: 0.5,
        },
        {
          label: '2023',
          data: this.data1,
          backgroundColor: ['#c7bebe'],
          borderColor: '#c7bebe', // Grey color
          borderWidth: 1,
          lineTension: 0.5,
        },
      ],
    };

    this.options = {
      scales: {
        y: {
          min: 0,
          max: 1,
          ticks: {
            stepSize: 0.1,
            callback: function (value: any, index: number, values: any) {
              return ((index + 0) * 0.1).toFixed(1);
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'RotaBlack',
                        },
          },
        },
      },
    };

    this.cities = [
      { name: 'All Category', code: 'NY' },
      { name: 'Los Angeles', code: 'LA' },
      { name: 'Chicago', code: 'CH' },
    ];

    this.Categories = [
      { name: 'swimming pool' },
      { name: 'tranquility' },
      { name: 'staff' },
      { name: 'Cleanliness' },
      { name: 'Facilities' },
      { name: 'Location' },
      { name: 'Breakfast' },
      { name: 'food' },
      { name: 'Atmosphere' },
    ];

    this.years = [
      { year: '2020' },
      { year: '2021' },
      { year: '2022' },
      { year: '2023' },
      { year: '2024' },
    ];
  }
}

function ElseIf() {
  throw new Error('Function not implemented.');
}
