import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { CountryData } from '../interfaces/world_map';
import * as Papa from 'papaparse';

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
    // this.getAllCountriesReview();
    this.getCountryReview();
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
            // Filter csvData based on the current country
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
    let country_review;
    for (let item in data) {
      let numberArr = data[item];

      bestReview = Math.max(...numberArr);
      leastReview = Math.min(...numberArr);

      this.sharedservice.getCountryReview(item).subscribe({
        next: (res: any) => {
          country_review = res;
        },
        error: (err: any) => {
          console.log(err);
        },
      });

      this.modifiedDataByCountry.push([
        item.toUpperCase(),
        bestReview,
        leastReview,
      ]);
    }

    this.drawRegionsMap(this.modifiedDataByCountry, this.annotations);
  }

  drawRegionsMap(finalData: any, annotations: any) {
    finalData.unshift(['Country', 'Best Score', 'Worst Score']);

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

  getAllCountriesReview() {
    this.sharedservice.getAllCountriesReview().subscribe({
      next: (res: any) => {},
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  getCountryReview() {
    this.sharedservice.getCountryReview('India').subscribe({
      next: (res: any) => {},
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
