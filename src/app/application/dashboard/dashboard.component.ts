import { Component, OnInit } from '@angular/core';
// import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as coorddata from '../../../assets/coordinate.json';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { count, map } from 'rxjs/operators';
import * as Papa from 'papaparse';
import { SharedService } from 'src/app/shared.service';
import { each } from 'chart.js/dist/helpers/helpers.core';

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
  // years: any[] = [];
  csvData: any;
  reviewsCount: number = 0;
  uniqueCountries: Set<string> = new Set();
  countryCount: number = 0;
  possitiveCount: number = 0;
  negativeCount: number = 0;
  neutral: number = 0;
  meanSentimentScore: any = 0;
  formattedYears: any[] = [];
  allYearsData: any = {};

  // constructor() {}

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
    let YearGraphData: any = [];
    let years: any = {};

    let yearData: any = {};

    this.http
      .get('assets/review_with_sentiments.csv', { responseType: 'text' })
      .subscribe((data) => {
        this.csvData = Papa.parse(data, { header: true }).data;

        let requiredDataset: any = [];

        this.csvData.forEach((each: any, index: number) => {
          const year = new Date(each.date).getFullYear();
          const date = new Date(each.date).getMonth() + 1;
          // if (year === 2023) {
          if (years[year]) {
            if (years[year][date]) {
              years[year][date] = [...years[year][date], each.sentiment_score];
            } else {
              years[year][date] = [each.sentiment_score];
            }
          } else {
            years[year] = { [date]: [each.sentiment_score] };
          }
          // }
        });

        let zeroArray: any = [];

        for (let i = 1; i <= 12; i++) {
          zeroArray.push(0);
        }
        for (let year in years) {
          YearGraphData.push(year);

          for (let x in years[year]) {
            // x is month ID

            let sum = 0;
            let count = 0;

            years[year][x].forEach((each: any) => {
              if (each !== 0) {
                sum += Number(each);
              } else {
                count++;
              }
            });

            zeroArray[Number(x) - 1] = (
              sum /
              (years[year][x].length - count)
            ).toFixed(2);
          }

          yearData = { ...yearData, [year]: zeroArray };
          zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        this.allYearsData = yearData;
        let keys = Object.keys(yearData);

        let lastKey = keys[keys.length - 1];

        delete yearData[lastKey];

        for (let i in yearData) {
          let color = 'red';
          if (i <= '2010') {
            color = 'green';
          } else if ('2010' < i && i <= '2015') {
            color = 'black';
          } else if ('2015' < i && i <= '2020') {
            color = 'blue';
          }
          requiredDataset.push({
            label: i,
            data: yearData[i],
            backgroundColor: [color],
            borderColor: color,
            borderWidth: 1,
            lineTension: 0.5,
          });
        }

        this.data = {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'June',
            'july',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],

          datasets: requiredDataset,
        };

        let sum = 0;
        let count = 0;
        for (let i = 0; i < this.csvData.length - 1; i++) {
          if (this.csvData[i].review && this.csvData[i].review.trim() !== '') {
            this.reviewsCount++;
          }
          const sentimentScore = parseFloat(this.csvData[i].sentiment_score);

          if (!isNaN(sentimentScore) && sentimentScore !== 0) {
            sum += sentimentScore;
          } else {
            count++;
          }

          this.meanSentimentScore = (
            sum /
            (this.csvData.length - count)
          ).toFixed(2);

          this.uniqueCountries.add(this.csvData[i].country);
          this.countryCount = this.uniqueCountries.size;

          if (this.csvData[i].sentiment_score > 0.6) {
            this.possitiveCount++;
          } else if (this.csvData[i].sentiment_score < 0.4) {
            this.negativeCount++;
          } else {
            this.neutral++;
          }
        }

        YearGraphData.push('All');

        YearGraphData.pop();

        this.formattedYears = YearGraphData.map((year: any) => ({ year }));
        this.formattedYears.pop();
      });

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

    YearGraphData = ['All'];
  }

  onSelectingYear(event: any) {
    let allYearsData: any = [];

    if (event.value.year === 'All') {
      for (let i in this.allYearsData) {
        let color = 'red';
        if (i <= '2010') {
          color = 'green';
        } else if ('2010' < i && i <= '2015') {
          color = 'black';
        } else if ('2015' < i && i <= '2020') {
          color = 'blue';
        }
        allYearsData.push({
          label: i,
          data: this.allYearsData[i],
          backgroundColor: [color],
          borderColor: color,
          borderWidth: 1,
          lineTension: 0.5,
        });
      }

      this.data = {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'july',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],

        datasets: allYearsData,
      };
    } else {
      this.data = {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'july',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: event.value.year,
            data: this.allYearsData[event.value.year],
            backgroundColor: ['red'],
            borderColor: 'red',
            borderWidth: 1,
            lineTension: 0.5,
          },
        ],
      };
    }

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
  }
}
