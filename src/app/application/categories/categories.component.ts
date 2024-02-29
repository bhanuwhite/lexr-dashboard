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
  summaryRecomendations: any = {};
  loading: boolean = true;
  selectedValue: any;
  formattedYears: any[] = [];
  allYearsData: any = {};
  allCategoriesOverTime: any[] = [];
  categorieMonthwise: any[] = [];

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

        this.allYearsData = years;

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

    // Category

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

    this.formattedYears = [
      { year: 'This Year' },
      { year: 'Last Year' },
      { year: 'Last 3 months' },
    ];

    this.getAllcatogryData();
    this.getsummaryAndRecomendations('hotel quality');

    this.csvallData();
  }

  getByYearData(event: any) {
    let Selectedyear;
    if (event.value.year === 'This Year') {
      Selectedyear = new Date().getFullYear();
    } else if (event.value.year === 'Last Year') {
      Selectedyear = new Date().getFullYear() - 1;
    } else {
      Selectedyear = new Date().getMonth() - 1;
    }

    if (
      Selectedyear === new Date().getFullYear() - 1 ||
      Selectedyear === new Date().getFullYear()
    ) {
      let requiredData: any[] = [];
      for (let year in this.yearData) {
        if (Number(year) === Selectedyear) {
          for (let i in this.yearData[Selectedyear]) {
            if (i === 'possitiveReviewData') {
              requiredData.push({
                type: 'bar',
                label: 'Positive Review',
                backgroundColor: ['#FF9F1C'],
                data: this.yearData[Selectedyear][i],
              });
            }
            if (i === 'negativeReviewData') {
              requiredData.push({
                type: 'bar',
                label: 'Negative Review',
                backgroundColor: ['#CB997E'],
                data: this.yearData[Selectedyear][i],
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
    } else {
      let requiredData: any[] = [];

      for (let year in this.yearData) {
        if (Number(year) === Selectedyear) {
          for (let i in this.yearData[Selectedyear]) {
            if (i === 'possitiveReviewData') {
              requiredData.push({
                type: 'bar',
                label: 'Positive Review',
                backgroundColor: ['#FF9F1C'],
                data: this.yearData[Selectedyear][i],
              });
            }
            if (i === 'negativeReviewData') {
              requiredData.push({
                type: 'bar',
                label: 'Negative Review',
                backgroundColor: ['#CB997E'],
                data: this.yearData[Selectedyear][i],
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
    }
  }

  /**get getAllcatogryData data */
  getAllcatogryData() {
    this.sharedservice.getAllCategories().subscribe(
      (res: any) => {
        this.allCategories = res.answer;
        this.allCategoriesOverTime = [...this.allCategories].sort();

        this.allCategoriesOverTime.unshift('all');
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }

  yearCheck(date: any) {
    const year = new Date(date).getFullYear();
    const currentYear = new Date().getFullYear();
    if (Number(year) == currentYear) {
      return true;
    } else {
      return false;
    }
  }
  monthCheck(date: any) {
    const month = new Date(date).getMonth() + 1;
    switch (month) {
      case 1:
        return '1';

      case 2:
        return '2';

      case 3:
        return '3';
      case 4:
        return '4';

      case 5:
        return '5';

      case 6:
        return '6';
      case 7:
        return '7';

      case 8:
        return '8';

      case 9:
        return '9';
      case 10:
        return '10';

      case 11:
        return '11';

      case 12:
        return '12';

      default:
        return '';
    }
  }

  csvallData() {
    let data2024 = this.csvData.filter((x: any) => this.yearCheck(x.date));
    let monthWiseData = data2024.map((x: any) => {
      return {
        month: this.monthCheck(x?.date),
        categories: JSON.parse(x?.categories.replace(/'/g, '"')),
      };
    });

    let properData: any[] = [];
    let jsonMonth: any = {};

    for (let i = 0; i < monthWiseData.length; i++) {
      const month = monthWiseData[i].month;

      const categories = monthWiseData[i].categories;
      let modifyObjectKey = Object.entries(categories);
      modifyObjectKey.map((x: any) => (x[0] = x[0].toUpperCase()));

      let modify = Object.fromEntries(modifyObjectKey);
      if (!jsonMonth[month]) {
        jsonMonth[month] = { month, categories: [modify] };
      } else {
        jsonMonth[month].categories.push(modify);
      }
    }

    for (let month in jsonMonth) {
      properData.push(jsonMonth[month]);
    }
    let jsonObjectData = Object.values(properData);

    return jsonObjectData;
  }

  average(data: any) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] === 'number' && !isNaN(data[i])) {
        sum += data[i];
        count++;
      }
    }

    if (count === 0) {
      return 0;
    }

    return Number((sum / count).toFixed(1));
  }
  chartData(event: string) {
    const data: any[] = this.csvallData();
    this.categorieMonthwise = data.map((x) => {
      return {
        month: x.month,
        categories: x.categories.map((y: any) => y[event]),
        avgValue: this.average(x.categories.map((y: any) => y[event])),
      };
    });
  }

  onSelectingCategory(event: any) {
    this.selectedValue = event.value.toUpperCase();
    if (this.selectedValue === 'ALL') {
      this.allCategories.forEach((element) => {
        this.chartData(element);
      });
    } else {
      this.chartData(this.selectedValue);
    }

    let month = new Date().getMonth();

    let requiredData: any[] = new Array(month).fill(0);

    this.categorieMonthwise.forEach((x: any) => {
      const monthIndex = x.month - 1;
      if (x.avgValue) {
        requiredData[monthIndex] = Number(x.avgValue);
      }
    });
    for (let i = 0; i <= month; i++) {
      if (requiredData[i] === undefined) {
        requiredData[i] = 0;
      }
    }

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
          label: this.selectedValue,
          backgroundColor: ['#FF9F1C'],
          data: requiredData,
          borderColor: '#FF9F1C',
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
          min: 0,
          max: 1,
          ticks: {
            stepSize: 0.1,
            callback: function (value: any, index: number, values: any) {
              return ((index + 0) * 0.1).toFixed(1);
            },
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

  getsummaryAndRecomendations(event: any) {
    this.loading = true;

    if (event == 'hotel quality') {
      this.sharedservice.getsummaryAndRecomendations(event).subscribe(
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
    if (event.value) {
      this.sharedservice.getsummaryAndRecomendations(event.value).subscribe(
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
  // onSelectingCategoryRecomandation(event: any) {}
}
