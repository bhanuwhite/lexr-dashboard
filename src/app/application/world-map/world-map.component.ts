import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
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
  countriesData: any;
  reviewsByCountry: any;
  modifiedDataByCountry: any[] = [];

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
    let bestReview;
    let leastReview;
    for (let item in data) {
      let numberArr = data[item];
      bestReview = Math.max(...numberArr);
      leastReview = Math.min(...numberArr);
      this.modifiedDataByCountry.push([
        item.toUpperCase(),
        bestReview,
        leastReview,
      ]);
    }
    this.drawRegionsMap(this.modifiedDataByCountry);
  }

  drawRegionsMap(finalData: any) {
    finalData.unshift(['Country', 'Best Review', 'Least Review']);

    var data = google.visualization.arrayToDataTable(finalData);

    var options = {
      colorAxis: { colors: ['#E39224', '#FF9F1C'] },
      chartArea: { width: '100%', height: '100%' },
    };

    var chart = new google.visualization.GeoChart(
      document.getElementById('regions_div')
    );

    chart.draw(data, options);
  }
}
