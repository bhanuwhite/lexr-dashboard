import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import {
  DropdownChangeEvent,
  LastThreeMonthsForReview,
  Options,
  ResponseData,
  DataForAllYears,
  ReviewData,
  categorieMonthwise,
  categoryResponce,
  datasetData,
  graphData,
  summaryEvent,
  summaryRecomendations,
  yearData,
  yearDataForSentimentGraph,
  years,
  yearsData,
  avgDataForCategories,
} from '../interfaces/categories';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  data!: graphData;
  options!: Options;
  dataa!: graphData;
  optionsss!: Options;
  bargraphData!: Options;
  csvData: any;
  possitiveReviewData: number[] = [];
  negativeReviewData: number[] = [];
  neutralReview: number = 0;
  yearData: yearData = {};
  allCategories: string[] = [];
  summaryRecomendations: summaryRecomendations = {
    summary: '',
    recomendation: [],
  };
  loading: boolean = true;
  categoryLoding!: boolean;
  selectedValue!: string;
  formattedYears: years[] = [];
  allYearsData: yearsData = {};
  allCategoriesOverTime: string[] = [];
  categorieMonthwise: categorieMonthwise[] = [];
  threeMonthsDataSet: categorieMonthwise[] = [];
  statusTrue!: string | number | boolean;
  private myChart: ECharts | null = null;

  selectedYear: years = {
    year: '',
  };

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

        console.log(this.csvData);

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

        let requiredData: datasetData[] = [];

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

    this.csvallData();
    this.InitPipe();
  }

  getByYearData(event: yearDataForSentimentGraph) {
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
      let requiredData: datasetData[] = [];

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
      let requiredData: datasetData[] = [];
      let currentYear = new Date().getFullYear();
      let currentmonth = new Date().getMonth();
      let LastThreeMonthsDataForReview: LastThreeMonthsForReview[] = [];

      for (let year in this.allYearsData) {
        if (Number(year) === currentYear) {
          let monthsAdded = 0;
          for (let x = currentmonth + 1; x > 0 && monthsAdded < 3; x--) {
            if (
              this.allYearsData[currentYear] &&
              this.allYearsData[currentYear][x] !== undefined
            ) {
              LastThreeMonthsDataForReview.unshift({
                month: x,
                possitiveReviewData:
                  this.allYearsData[currentYear][x].positiveReview,
                negativeReviewData:
                  this.allYearsData[currentYear][x].negativeReview,
                positiveReviewData: 0,
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
                LastThreeMonthsDataForReview.unshift({
                  month: x,
                  possitiveReviewData:
                    this.allYearsData[currentYear - 1][x].positiveReview,
                  negativeReviewData:
                    this.allYearsData[currentYear - 1][x].negativeReview,
                  positiveReviewData: 0,
                });
                monthsAdded++;
              }
            }
          }
        }
      }

      console.log(LastThreeMonthsDataForReview);

      let positiveData = [];
      let negativeData = [];
      let months = [];

      for (let i = 0; i < LastThreeMonthsDataForReview.length; i++) {
        for (let item in LastThreeMonthsDataForReview[i]) {
          if (item === 'negativeReviewData') {
            negativeData.push(LastThreeMonthsDataForReview[i][item]);
          } else if (item === 'possitiveReviewData') {
            positiveData.push(LastThreeMonthsDataForReview[i][item]);
          } else {
            months.push(
              this.monthsCheck(LastThreeMonthsDataForReview[i][item])
            );
          }
        }
      }

      let dataArray = {
        positiveReview: positiveData,
        negativeReview: negativeData,
      };
      for (let item in dataArray) {
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
        const categoryResponce = res as categoryResponce;

        this.allCategoriesOverTime = categoryResponce.answer.sort();

        let firstElement = this.allCategoriesOverTime[0];

        let firstElementBody = {
          value: firstElement,
        };

        this.onSelectingCategory(firstElementBody);
        this.getsummaryAndRecomendations(firstElementBody);
      },
      (error: Error) => {
        alert(error.message);
      }
    );
  }
  getsummaryAndRecomendations(event: summaryEvent) {
    this.loading = true;
    let selectedValue: string = '';
    if (event.value) {
      selectedValue = event.value;
    }

    this.sharedservice.getsummaryAndRecomendations(selectedValue).subscribe(
      (res: any) => {
        // const summaryResponce = res as ResponseData;

        this.statusTrue = res.status;
        this.loading = false;
        if (res.answer.length > 0) {
          this.summaryRecomendations = res.answer;
        }
      },
      (error: any) => {
        this.statusTrue = error.status;
        this.loading = false;
      }
    );
  }

  yearCheck(date: Date) {
    const year = new Date(date).getFullYear();
    return year;
  }

  monthCheck(date: Date) {
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
  monthsCheck(month: number) {
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
    let allYearsData = this.csvData?.map((x: ReviewData) => {
      const year = this.yearCheck(x.date);
      const month = this.monthCheck(x.date);
      const categories = x.categories
        ? JSON.parse(String(x.categories).replace(/'/g, '"'))
        : {};

      return {
        year: year,
        month: month,
        categories: categories,
      };
    });

    let DataForCategories: avgDataForCategories[] = [];
    let allYearsDataForCategories: any = {};

    for (let i = 0; i < allYearsData?.length; i++) {
      const year = allYearsData[i].year;
      const month = allYearsData[i].month;
      const categories = allYearsData[i].categories;

      let modifyObjectKey = Object.entries(categories);
      modifyObjectKey.map((x: any) => (x[0] = x[0].toUpperCase()));

      let modifyCategories = Object.fromEntries(modifyObjectKey);

      if (!allYearsDataForCategories[year]) {
        allYearsDataForCategories[year] = {};
      }

      if (!allYearsDataForCategories[year][month]) {
        allYearsDataForCategories[year][month] = {
          year,
          month,
          categories: [modifyCategories],
        };
      } else {
        allYearsDataForCategories[year][month].categories.push(
          modifyCategories
        );
      }
    }

    for (let year in allYearsDataForCategories) {
      for (let month in allYearsDataForCategories[year]) {
        DataForCategories.push(allYearsDataForCategories[year][month]);
      }
    }

    let jsonObjectData = Object.values(DataForCategories);
    return jsonObjectData;
  }

  average(data: number[]) {
    let sum = 0;
    let removedUndefinedData: number[] = data.filter(
      (x: number | undefined) => x !== undefined
    );

    if (removedUndefinedData) {
      for (let i = 0; i < removedUndefinedData.length; i++) {
        sum += removedUndefinedData[i];
      }
    }
    return Number((sum / removedUndefinedData.length).toFixed(1));
  }
  selectedDataFilter(event: string, selectedYear1: number) {
    const data: any[] = this.csvallData();

    this.categorieMonthwise = data
      .filter((x) => x.year === selectedYear1)
      .map((x) => ({
        month: x.month,
        categories: x.categories.map((y: any) => y[event]),
        avgValue: this.average(x.categories.map((y: any) => y?.[event])),
        label: event,
      }));
  }

  LastThreeMonthsData(event: string) {
    const data = this.csvallData();
    console.log(data);

    let last3Objects = data.splice(-4);

    this.threeMonthsDataSet = last3Objects.map((x: any) => {
      return {
        month: x.month,
        categories: x.categories.map((y: any) => y[event]),
        avgValue: this.average(x.categories.map((y: any) => y?.[event])),
        label: event,
      };
    });
  }
  /**selecting value */
  onSelectingCategory(event: summaryEvent) {
    this.categoryLoding = false;

    if (event.value) {
      this.selectedValue = event.value.toUpperCase();
    }

    if (this.selectedYear.year === 'This Year') {
      const currentYear = new Date().getFullYear();
      this.selectedDataFilter(this.selectedValue, currentYear);
      this.selectedCategoriGraphData();
    } else if (this.selectedYear.year === 'Last Year') {
      const year = new Date().getFullYear() - 1;
      this.selectedDataFilter(this.selectedValue, year);
      this.selectedCategoriGraphData();
    } else {
      this.LastThreeMonthsData(this.selectedValue);
      this.graphPlotingForLast3Months(this.threeMonthsDataSet);
    }
  }

  /**Getting data based on years */
  getCategoriesByYear(event: DropdownChangeEvent) {
    if (event.value.year === 'This Year') {
      let currentYear = new Date().getFullYear();
      this.selectedDataFilter(this.selectedValue, currentYear);
      this.selectedCategoriGraphData();
    } else if (event.value.year === 'Last Year') {
      let previousYear = new Date().getFullYear() - 1;
      this.selectedDataFilter(this.selectedValue, previousYear);
      this.selectedCategoriGraphData();
    } else {
      this.LastThreeMonthsData(this.selectedValue);
      this.graphPlotingForLast3Months(this.threeMonthsDataSet);
    }
  }

  /**graph ploting for Last 12 month  */
  graphPlotingForLast3Months(dataset: categorieMonthwise[]) {
    let datasetArr: datasetData[] = [];
    let month: string[] = [];

    let label = dataset[0]['label'];
    let data: number[] = [];
    let jsonData: datasetData = {
      label: '',
      data: [],
    };
    for (let i = 0; i < dataset.length - 1; i++) {
      {
        (jsonData.fill = false),
          (jsonData.tension = 0.4),
          (jsonData.borderColor = '#FF9F1C'),
          (jsonData.label = label);
      }

      if (!Number.isNaN(dataset[i]['avgValue'])) {
        data.push(dataset[i]['avgValue']);
      } else {
        data.push(0);
      }

      month.push(this.monthsCheck(Number(dataset[i]['month'])));
    }
    jsonData['data'] = data;

    datasetArr.push(jsonData);

    this.dataa = {
      labels: month,
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
  selectedCategoriGraphData() {
    let month = new Date().getMonth() - 1;

    let requiredData: number[] = new Array(month).fill(0);

    this.categorieMonthwise.forEach((x: categorieMonthwise) => {
      const monthIndex: number = Number(x.month) - 1;
      if (x.avgValue) {
        requiredData[monthIndex] = Number(x.avgValue);
      } else {
        requiredData[monthIndex] = 0;
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
            callback: function (value: number, index: number, values: number) {
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
          radius: ['80%', '88%'],
          avoidLabelOverlap: false,
          padAngle: 1,
          itemStyle: {
            borderRadius: 7,
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
                fontSize: '40',
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
