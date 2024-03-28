import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { CountryData } from '../interfaces/world_map';
import * as Papa from 'papaparse';
const countryData = require('country-data').countries;
declare var google: any;

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WorldMapComponent implements OnInit {
  csvData: any[] = [];
  uniqueCountries: Set<string> = new Set();
  annotations: any[] = [];
  reviewsByCountry: CountryData = {};
  modifiedDataByCountry: any[] = [];
  loader: boolean = false;
  chartData!: any[];
  chartType!: string;

  constructor(
    private sharedservice: SharedService,
    private Route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
  }

  ngOnInit() {
    google.charts.load('current', {
      packages: ['geochart'],
    });
    google.charts.setOnLoadCallback(() => {
      this.csvAllData();
    });
  }

  csvAllData() {
    this.http
      .get('assets/review_with_sentiments.csv', { responseType: 'text' })
      .subscribe((data) => {
        this.csvData = Papa.parse(data, { header: true }).data;

        this.csvData.forEach((x) => {
          if (x.country) {
            this.uniqueCountries.add(x.country.toLowerCase());
          }
        });
        this.reviewsByCountry = Array.from(this.uniqueCountries).reduce(
          (acc: { [x: string]: any[] }, country: string) => {
            const reviewsForCountry = this.csvData
              .filter(
                (obj: any) =>
                  obj.country?.toLowerCase() === country.toLowerCase()
              )
              .map((obj: any) => obj.sentiment_score);

            acc[country] = reviewsForCountry;

            return acc;
          },
          {}
        );

        this.calculateReview(this.reviewsByCountry);
      });
  }

  calculateReview(data: any) {
    this.loader = true;
    let bestReview;
    let leastReview;
    let avgValue;
    for (let item in data) {
      let numberArr = data[item];
      let sum = 0;
      bestReview = Math.max(...numberArr);
      leastReview = Math.min(...numberArr);

      for (let i = 0; i < numberArr.length; i++) {
        sum += Number(numberArr[i]);
      }
      avgValue = Number((sum / numberArr.length).toFixed(2));

      this.modifiedDataByCountry.push([
        item.toUpperCase(),
        bestReview,
        leastReview,
      ]);
    }
    this.drawRegionsMap(this.modifiedDataByCountry);
  }

  drawRegionsMap(finalData: any) {
    console.log(finalData);

    finalData.unshift(['Country', 'Best Score', 'LeastReview']);

    var data = google.visualization.arrayToDataTable(finalData);

    var options = {
      colorAxis: { colors: ['#F8CB91', '#F8AE4C', '#FF960D'] },
      chartArea: { width: '100%', height: '100%' },
    };

    var chart = new google.visualization.GeoChart(
      document.getElementById('regions_div')
    );

    chart.draw(data, options);

    this.loader = false;
  }
}
