import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  data: any;

  options: any;
  dataa: any;
  dataaa: any;
  doughnutOptions: any;
  optionsss: any;
  bargraphData: any;
  csvData: any;
  possitiveReviewData: number[] = [];
  negativeReviewData: number[] = [];
  neutralReview: number = 0;
  yearData: any = {};

  constructor(
    private sharedservice: SharedService,
    private Route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
  }

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    let YearGraphData: any = [];
    let years: any = {};

    this.http
      .get('assets/review_with_sentiments.csv', { responseType: 'text' })
      .subscribe((data) => {
        this.csvData = Papa.parse(data, { header: true }).data;

        this.csvData.forEach((each: any) => {
          const year = new Date(each.date).getFullYear();
          const date = new Date(each.date).getMonth() + 1;

          // Check if the year exists in the years object
          if (!years[year]) {
            years[year] = {};
          }
          if (!years[year][date]) {
            years[year][date] = { positiveReview: 0, negativeReview: 0 };
          }
          if (parseFloat(each.sentiment_score) > 0.6) {
            years[year][date].positiveReview++;
          } else if (
            parseFloat(each.sentiment_score) > 0 &&
            parseFloat(each.sentiment_score) < 0.4
          ) {
            years[year][date].negativeReview++;
          }
        });

        let requiredData: any[] = [];

        for (let year in years) {
          this.yearData[year] = {
            possitiveReviewData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            negativeReviewData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          };

          for (let month in years[year]) {
            if (month) {
              if (years[year][month].positiveReview) {
                this.yearData[year].possitiveReviewData[parseInt(month) - 1] =
                  years[year][month].positiveReview;
              }

              if (years[year][month].negativeReview) {
                this.yearData[year].negativeReviewData[parseInt(month) - 1] =
                  years[year][month].negativeReview;
              }
            }
          }
        }

        for (let i in this.yearData['2023']) {
          console.log(this.yearData['2023'][i]);
          if (i === 'possitiveReviewData') {
            requiredData.push({
              type: 'bar',
              label: 'Positive Review',
              backgroundColor: ['#FF9F1C'],
              data: this.yearData[2023][i],
            });
          }
          if (i === 'negativeReviewData') {
            requiredData.push({
              type: 'bar',
              label: 'Negative Review',
              backgroundColor: ['#CB997E'],
              data: this.yearData[2023][i],
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
          datasets: requiredData,
        };
      });

    this.bargraphData = {
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.dataaa = {
      labels: [
        'Best comment',
        'Worst comment',
        'Summary comment',
        'Average sentiment score',
      ],
      datasets: [
        {
          data: [200, 50, 100, 70],
          backgroundColor: ['#FF9F1C', '#CB997E', '#AF9455', '#FFBF69'],
        },
      ],
    };

    this.dataa = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Current Year',
          backgroundColor: ['#FF9F1C'],
          data: [65, 80, 55, 75, 56, 90, 40],
          borderColor: '#FF9F1C',
          borderWidth: 2,
          lineTension: 0.5,
        },
        {
          label: 'Last Year',
          data: [40, 65, 30, 70, 20, 80, 16],
          backgroundColor: ['#c7bebe'],
          borderColor: '#c7bebe', // Grey color
          borderWidth: 2,
          lineTension: 0.5,
        },
      ],
    };

    this.optionsss = {
      scales: {
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

    this.doughnutOptions = {
      cutout: '85%',
      elements: {
        arc: {
          borderRadius: 10,
        },
      },
      label: {
        position: 'center',
      },

      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
