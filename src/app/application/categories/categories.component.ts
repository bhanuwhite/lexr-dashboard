import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { each } from 'chart.js/dist/helpers/helpers.core';
import { last } from 'rxjs';
import * as echarts from 'echarts';
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
  categoryLoding!: boolean;
  selectedValue: any;
  formattedYears: any[] = [];
  allYearsData: any = {};
  allCategoriesOverTime: any[] = [];
  categorieMonthwise: any[] = [];
  dataSet: any[] = [];
  statusTrue: any;
  private myChart: any = null;

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

    this.formattedYears = [
      { year: 'This Year' },
      { year: 'Last Year' },
      { year: 'Last 3 months' },
    ];

    this.getAllcatogryData();

    this.getsummaryAndRecomendations('hotel quality');

    this.csvallData();
    this.InitPipe();
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
          //(this.yearData);

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
      //(requiredData);

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
      let currentYear = new Date().getFullYear();
      let currentmonth = new Date().getMonth();
      let LastThreeMonthsData: any[] = [];
      // let
      for (let year in this.allYearsData) {
        if (Number(year) === currentYear) {
          let monthsAdded = 0;
          for (let x = currentmonth + 1; x > 0 && monthsAdded < 3; x--) {
            if (
              this.allYearsData[currentYear] &&
              this.allYearsData[currentYear][x] !== undefined
            ) {
              LastThreeMonthsData.unshift({
                month: x,
                possitiveReviewData:
                  this.allYearsData[currentYear][x].positiveReview,
                negativeReviewData:
                  this.allYearsData[currentYear][x].negativeReview,
              });
              monthsAdded++;
            }
          }

          // If necessary, loop through the previous year
          if (monthsAdded < 3) {
            for (let x = 12; x > 0 && monthsAdded < 3; x--) {
              if (
                this.allYearsData[currentYear - 1] &&
                this.allYearsData[currentYear - 1][x] !== undefined
              ) {
                LastThreeMonthsData.unshift({
                  month: x,
                  possitiveReviewData:
                    this.allYearsData[currentYear - 1][x].positiveReview,
                  negativeReviewData:
                    this.allYearsData[currentYear - 1][x].negativeReview,
                });
                monthsAdded++;
              }
            }
          }
        }
      }

      let positiveData = [];
      let negativeData = [];
      let months = [];

      for (let i = 0; i < LastThreeMonthsData.length; i++) {
        for (let item in LastThreeMonthsData[i]) {
          if (item === 'negativeReviewData') {
            negativeData.push(LastThreeMonthsData[i][item]);
          } else if (item === 'possitiveReviewData') {
            positiveData.push(LastThreeMonthsData[i][item]);
          } else {
            months.push(this.monthsCheck(LastThreeMonthsData[i][item]));
          }
        }
      }

      let dataArray = {
        positiveReview: positiveData,
        negativeReview: negativeData,
      };
      //(months);

      // //(dataArray);

      // for (let i in LastThreeMonthsData) {

      for (let item in dataArray) {
        // //(item);

        if (item === 'positiveReview') {
          requiredData.push({
            type: 'bar',
            label: 'Positive Review',
            backgroundColor: ['#FF9F1C'],
            data: dataArray[item],
            borderWidth: 0.2,
          });
        }
        if (item === 'negativeReview') {
          requiredData.push({
            type: 'bar',
            label: 'Negative Review',
            backgroundColor: ['#CB997E'],
            data: dataArray[item],
            borderWidth: 0.2,
          });
        }
      }

      //(requiredData);

      this.data = {
        labels: months,
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

        this.allCategoriesOverTime.unshift('All Categories');
        this.onSelectingCategory('All CATEGORIES');
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
  monthsCheck(month: any) {
    switch (month) {
      case 1:
        return 'Jan';

      case 2:
        return 'Feb';

      case 3:
        return 'Mar';
      case 4:
        return 'April';

      case 5:
        return 'May';

      case 6:
        return 'June';
      case 7:
        return 'July';

      case 8:
        return 'Aug';

      case 9:
        return 'sep';
      case 10:
        return 'Oct';

      case 11:
        return 'Nov';

      case 12:
        return 'Dec';

      default:
        return '';
    }
  }

  csvallData() {
    let data2024 = this.csvData?.filter((x: any) => this.yearCheck(x.date));
    let monthWiseData = data2024?.map((x: any) => {
      return {
        month: this.monthCheck(x?.date),
        categories: JSON.parse(x?.categories.replace(/'/g, '"')),
      };
    });

    let properData: any[] = [];
    let jsonMonth: any = {};

    for (let i = 0; i < monthWiseData?.length; i++) {
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

    let removedUndefinedData: any[] = data.filter((x: any) => x !== undefined);

    for (let i = 0; i < removedUndefinedData.length; i++) {
      sum += removedUndefinedData[i];
    }

    return Number((sum / removedUndefinedData.length).toFixed(1));
  }
  chartData(event: string) {
    const data: any[] = this.csvallData();

    this.categorieMonthwise = data.map((x) => {
      return {
        month: x.month,
        categories: x.categories.map((y: any) => y[event]),
        avgValue: this.average(x.categories.map((y: any) => y?.[event])),
        label: event,
      };
    });
  }
  allDataset(event: any) {
    const data: any[] = this.csvallData();

    this.categorieMonthwise = data.map((x) => {
      return {
        month: x.month,
        categories: x.categories.map((y: any) => y[event]),
        avgValue: this.average(x.categories.map((y: any) => y?.[event])),
        label: event,
      };
    });

    const daTa = this.categorieMonthwise.map((x) => {
      return {
        label: x?.label,
        month: x?.month,
        avgValue: x?.avgValue,
      };
    });
    this.dataSet.push(daTa);
  }
  /**selecting value */
  onSelectingCategory(event: any) {
    this.categoryLoding = false;

    if (event.value) {
      this.selectedValue = event.value.toUpperCase();
    } else {
      this.selectedValue = event.toUpperCase();
    }

    if (this.selectedValue === 'ALL CATEGORIES') {
      this.allCategories.forEach((element) => {
        this.allDataset(element.toUpperCase());
      });

      this.graphPloting(this.dataSet);
    } else {
      this.chartData(this.selectedValue);
      this.categoriGraphData();
    }
  }
  /**graph ploting for all */
  graphPloting(dataset: any) {
    let datasetArr: any[] = [];
    for (let i = 0; i < dataset.length; i++) {
      let jsonData: any = {
        fill: false,
        tension: 0.4,
        borderColor: ['#FF9F1C'],
      };
      let data: any[] = [];
      for (let j = 0; j < dataset[i].length; j++) {
        jsonData['label'] = dataset[i][0]['label'];
        if (!Number.isNaN(dataset[i][j]['avgValue'])) {
          data.push(dataset[i][j]['avgValue']);
        } else {
          data.push(0);
        }
        jsonData['data'] = data;
      }
      datasetArr.push(jsonData);
    }
    // //(datasetArr);
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
      datasets: datasetArr,
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
          display: false,
        },
      },
    };
  }
  /**graph ploting */
  categoriGraphData() {
    let month = new Date().getMonth() - 1;

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
          this.statusTrue = res.status;
          this.summaryRecomendations = res.answer;
        },
        (error: any) => {
          // alert(error.message);
          this.statusTrue = error.status;

          this.loading = false;
        }
      );
    }
    if (event.value) {
      this.sharedservice.getsummaryAndRecomendations(event.value).subscribe(
        (res: any) => {
          this.statusTrue = res.status;
          this.loading = false;
          this.summaryRecomendations = res.answer;
        },
        (error: any) => {
          this.statusTrue = error.status;
          this.loading = false;
        }
      );
    }
  }

  private InitPipe(): void {
    this.myChart = echarts.init(document.getElementById('pipe') as any);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
          return `${params.name}: ${params.value} (${params.percent}%)`;
        },
      },
      legend: {
        show: false, // Remove legend
      },
      color: [
        '#FF9F1C',
        '#CB997E',
        '#AF9455',
        '#FFBF69',
        '#FF9F1C',
        '#CB997E',
        '#AF9455',
        '#FFBF69',
      ],
      series: [
        {
          name: 'Number of reviews per category',
          type: 'pie',
          radius: ['45%', '52%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 15,
          },
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              formatter: '{c}',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 200, name: 'Best comment' },
            { value: 50, name: 'Worst comment' },
            { value: 100, name: 'Summary comment' },
            { value: 70, name: 'Location' },
            { value: 150, name: 'Staff' },
            { value: 75, name: 'access' },
            { value: 90, name: 'Accessbility' },
            { value: 160, name: 'Accommodation' },
          ],
        },
      ],
    };

    this.myChart.setOption(option);
  }
}
