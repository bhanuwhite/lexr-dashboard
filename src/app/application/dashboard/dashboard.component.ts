import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  currentYear: any = 0;
  // constructor() {}

  constructor(
    private sharedservice: SharedService,
    private Route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
    this.currentYear = new Date().getFullYear();
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
          const dateData = new Date(each.date).getDate();

          if (years[year]) {
            if (years[year][date]) {
              years[year][date] = [...years[year][date], each.sentiment_score];
            } else {
              years[year][date] = [each.sentiment_score];
            }
          } else {
            years[year] = { [date]: [each.sentiment_score] };
          }
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
          zeroArray = [, , , , , , , , , , ,];
        }

        this.allYearsData = yearData;
        let keys = Object.keys(yearData);

        let lastKey = keys[keys.length - 1];

        delete yearData[lastKey];

        for (let i in yearData) {
          let color = '#FF9F1C';
          if (i === '2023') {
            color = '#c7bebe';
          }

          if (i === '2023' || i === '2024') {
            requiredDataset.push({
              label: i,
              data: yearData[i],
              backgroundColor: [color],
              borderColor: color,
              borderWidth: 1,
              lineTension: 0.5,
            });
          }
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

    this.formattedYears = [{ year: 'This Year' }, { year: 'This Month' }];

    YearGraphData = ['All'];
  }

  monthsData: any = [];
  onSelectingYear(event: any) {
    let allYearsData: any = [];

    if (event.value.year === 'This Year') {
      for (let i in this.allYearsData) {
        let color = '#FF9F1C';
        if (i === '2023') {
          color = '#c7bebe';
        }

        if (
          Number(i) === this.currentYear - 1 ||
          Number(i) === this.currentYear
        ) {
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
      }
    } else {
      const years: any = {};

      this.csvData.forEach((each: any) => {
        const year = new Date(each.date).getFullYear();
        const month = new Date(each.date).getMonth() + 1;
        const date = new Date(each.date).getDate();

        if (!years[year]) {
          years[year] = {};
        }

        if (!years[year][month]) {
          years[year][month] = {};
        }

        if (!years[year][month][date]) {
          years[year][month][date] = [];
        }

        years[year][month][date].push(parseFloat(each.sentiment_score));
      });

      Object.keys(years).forEach((year: any) => {
        Object.keys(years[year]).forEach((month: any) => {
          const daysInMonth = new Date(year, month, 0).getDate();
          for (let date = 1; date <= daysInMonth; date++) {
            if (!years[year][month][date]) {
              years[year][month][date] = 0;
            } else {
              const scores = years[year][month][date];
              const averageScore =
                scores.reduce((acc: any, curr: any) => acc + curr, 0) /
                scores.length;
              years[year][month][date] = averageScore.toFixed(2);
            }
          }
        });
      });

      const monthsData: any[] = [];
      const currentmonth = new Date().getMonth() + 1;
      const today = new Date().getDate();

      for (let month in years[this.currentYear]) {
        const monthValues: any[] = [];

        if (Number(month) === currentmonth) {
          for (let day = 1; day <= 31; day++) {
            if (day < today) {
              if (years[this.currentYear][month][day]) {
                monthValues.push(years[this.currentYear][month][day]);
              } else {
                monthValues.push(0);
              }
            }
          }
        } else {
          for (let day = 1; day <= 31; day++) {
            if (years[this.currentYear][month][day]) {
              monthValues.push(years[this.currentYear][month][day]);
            } else {
              monthValues.push(0);
            }
          }
        }

        monthsData.push(monthValues);
      }
      const daysOfMonth: number[] = Array.from(
        { length: 31 },
        (_, index) => index + 1
      );

      const currentMonthName = new Date().toLocaleString('default', {
        month: 'long',
      });
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthName = previousMonth.toLocaleString('default', {
        month: 'long',
      });

      let month: any;
      for (let i in monthsData) {
        let color = '#FF9F1C';
        if (i === '0') {
          color = '#c7bebe';
        }
        if (Number(i) === new Date().getMonth()) {
          month = currentMonthName;
        } else if (Number(i) === new Date().getMonth() - 1) {
          month = previousMonthName;
        }
        {
          allYearsData.push({
            label: month,
            data: monthsData[i],
            backgroundColor: [color],
            borderColor: color,
            borderWidth: 1,
            lineTension: 0.5,
          });
        }

        this.data = {
          labels: daysOfMonth,

          datasets: allYearsData,
        };
      }
    }
  }
}
