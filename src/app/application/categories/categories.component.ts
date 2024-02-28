import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { each } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  data: any;

  options: any;
  dataa: any;
  doughnutDataaa: any;
  doughnutOptions: any;
  optionsss: any;
  bargraphData: any;
  csvData: any;
  possitiveReviewData: number[] = [];
  negativeReviewData: number[] = [];
  neutralReview: number = 0;
  yearData: any = {};
  allCategories: any[] = [];
  summaryRecomendations: string = '';
  loading!: boolean;
  // allCSVData: any = {};

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
    const surfaceBorder = document;
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
        let currentYear = new Date().getFullYear();
        for (let year in this.yearData) {
          if (Number(year) === currentYear) {
            for (let i in this.yearData[currentYear]) {
              if (i === 'possitiveReviewData') {
                requiredData.push({
                  type: 'bar',
                  label: 'Positive Review',
                  backgroundColor: ['#FF9F1C'],
                  data: this.yearData[currentYear][i],
                });
              }
              if (i === 'negativeReviewData') {
                requiredData.push({
                  type: 'bar',
                  label: 'Negative Review',
                  backgroundColor: ['#CB997E'],
                  data: this.yearData[currentYear][i],
                });
              }
            }
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
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
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

    //Category

    // this.allCategories=;

    this.sharedservice.getAllCategories().subscribe(
      (res: any) => {
        this.allCategories = res.answer.sort();
      },
      (error: any) => {
        alert(error.message);
      }
    );

    this.dataa = {
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
          label: 'Current Year',
          backgroundColor: ['#FF9F1C'],
          data: [10, 30, 40, 20, 55, 30, 60, 30, 35, 45, 40, 80],
          borderColor: '#FF9F1C',
          borderWidth: 1,
          lineTension: 0.5,
        },
        {
          label: 'Last Year',
          data: [40, 65, 30, 70, 20, 30, 16, 50, 40, 30, 26, 35],
          backgroundColor: ['#c7bebe'],
          borderColor: '#c7bebe', // Grey color
          borderWidth: 1,
          lineTension: 0.5,
        },
      ],
    };

    this.options = {
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
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

    //doughnutDataaa
    this.doughnutDataaa = {
      labels: [
        'Best comment',
        'Worst comment',
        'Summary comment',
        'Average sentiment score',
      ],
      label: {
        show: false,
        position: 'center',
      },
      datasets: [
        {
          data: [200, 50, 100, 70],
          backgroundColor: ['#FF9F1C', '#CB997E', '#AF9455', '#FFBF69'],
        },
      ],
    };

    this.doughnutOptions = {
      cutout: '85%',
      elements: {
        arc: {
          borderRadius: 10,
        },
      },
      tooltip: {
        trigger: 'item',
        position: 'center',
      },
      legend: {
        top: '5%',
        left: 'center',
        position: 'center',
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    // Summary And recommenadations

    this.getsummaryAndRecomendations();
    this.loading = true;
  }

  onDataSelect(event: any) {
    console.log('hii');

    console.log(event.element);

    console.log(this.doughnutDataaa.labels[event.element._index]);
  }

  onSelectingCategory(event: any) {
    console.log(event.value);
    let value = event.value;
    console.log(this.csvData);
    let years: any = {};

    this.csvData.forEach((each: any, index: number) => {
      const year = new Date(each.date).getFullYear();
      const date = new Date(each.date).getMonth() + 1;
      const dateData = new Date(each.date).getDate();

      if (years[year]) {
        if (years[year][date]) {
          if (each.categories && each.categories.length > 0) {
            years[year][date] = [...years[year][date], each.categories];
          }
        } else {
          if (each.categories && each.categories.length > 0) {
            years[year][date] = [each.categories];
          }
        }
      } else {
        if (each.categories && each.categories.length > 0) {
          years[year] = { [date]: [each.categories] };
        }
      }
    });

    console.log(years[2024]);

    // for (let month in years[2024]) {
    //   // Parse each string into a JavaScript object
    //   const objects = years[2024][month]
    //     .map((str: string) => {
    //       try {
    //         // Use eval to evaluate the string as JavaScript code
    //         return eval(`(${str})`);
    //       } catch (error) {
    //         // Handle parsing errors
    //         console.error(`Error parsing object: ${error}`);
    //         return null; // or handle the error in another way
    //       }
    //     })
    //     .filter((obj: any) => obj !== null); // Remove any null objects

    //   // Iterate over each object
    //   objects.forEach((obj: any) => {
    //     // console.log(obj);

    //     // Get the keys of the object and print them
    //     const keys = Object.keys(obj);
    //     console.log(keys);
    //   });
    // }
  }

  getsummaryAndRecomendations() {
    this.sharedservice.getsummaryAndRecomendations().subscribe(
      (res: any) => {
        this.loading = false;
        this.summaryRecomendations = res.answer;
      },
      (error: any) => {
        alert(error.message);
        this.loading = false;
      }
    );
  }
}
