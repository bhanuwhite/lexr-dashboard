import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as Papa from 'papaparse';
import { SharedService } from 'src/app/shared.service';

import {
  Options,
  Review,
  allYearsData,
  categoryData,
  dataset,
  graphData,
  yearsAllData,
  yearsArray,
  DropdownChangeEvent,
  yearsAllDataFormonth,
  YearData,
} from '../interfaces/dashboard';
import { number } from 'echarts';
import {
  ReviewData,
  avgDataForCategories,
  categorieMonthwise,
  datasetData,
  summaryEvent,
} from '../interfaces/categories';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  visibleSidebar1!: boolean;
  data!: graphData;
  options!: any;
  allCategories: string[] = [];
  csvData: any[] = [];
  reviewsCount: number = 0;
  uniqueCountries: Set<string> = new Set();
  countryCount: number = 0;
  possitiveCount: number = 0;
  negativeCount: number = 0;
  neutral: number = 0;
  meanSentimentScore: number = 0;
  formattedYears: yearsArray[] = [];
  allYearsData: allYearsData = {};
  currentYear: number = 0;
  selectedYear: any;
  categorieMonthwise: categorieMonthwise[] = [];
  threeMonthsDataSet: categorieMonthwise[] = [];
  selectedValue: string = '';
  dataa!: any;
  summaryRecomendations: any;
  TrendsCategoryDetials: any[] = [];
  performanceLoader: boolean = false;

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
    let YearGraphData: string[] = [];
    let years: yearsAllData = {};

    let yearData: any = {};

    this.http
      .get('assets/review_with_sentiments.csv', { responseType: 'text' })
      .subscribe((data) => {
        this.csvData = Papa.parse(data, { header: true }).data;

        let requiredDataset: dataset[] = [];

        this.csvData.forEach((each: Review) => {
          const year = new Date(each.date).getFullYear();
          const date = new Date(each.date).getMonth() + 1;
          const dateData = new Date(each.date).getDate();

          if (years[year]) {
            if (years[year][date]) {
              years[year][date] = [
                ...years[year][date],
                Number(each.sentiment_score),
              ];
            } else {
              years[year][date] = [Number(each.sentiment_score)];
            }
          } else {
            years[year] = { [date]: [each.sentiment_score] };
          }
        });

        interface NumericArray extends Array<number | undefined | string> {}

        let zeroArray: NumericArray = [];

        for (let i = 1; i <= 12; i++) {
          zeroArray.push(0);
        }

        for (let year in years) {
          YearGraphData.push(year);

          for (let x in years[year]) {
            let sum = 0;
            let count = 0;

            years[year][x].forEach((each: number | string) => {
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
          const sentimentScore = parseFloat(
            String(this.csvData[i].sentiment_score)
          );

          if (!isNaN(sentimentScore) && sentimentScore !== 0) {
            sum += sentimentScore;
          } else {
            count++;
          }

          this.meanSentimentScore = Number(
            (sum / (this.csvData.length - count)).toFixed(2)
          );

          if (this.csvData[i].country) {
            this.uniqueCountries.add(this.csvData[i].country.toLowerCase());
          }

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
            callback: function (value: number, index: number, values: number) {
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

    this.getAllcatogryData();

    this.formattedYears = [
      { year: 'This Year' },
      { year: 'Last Year' },
      { year: 'Last 3 months' },
    ];
    YearGraphData = ['All'];

    this.getTrendsCategoriesByWeek();
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

  getAllcatogryData() {
    this.sharedservice.getAllCategories().subscribe(
      (res: any) => {
        this.allCategories = res?.answer?.sort();
        // this.allCategoriesOverTime = categoryResponce.answer.sort();

        let firstElement = this.allCategories[0];

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

  getsummaryAndRecomendations(selectedCategory: any) {
    let selectedValue: string = '';
    if (selectedCategory.value) {
      selectedValue = selectedCategory.value;
    } else {
      selectedValue = selectedCategory;
    }

    let summaryRecomendations;
    this.sharedservice.getsummaryAndRecomendations(selectedValue).subscribe(
      (res: any) => {
        summaryRecomendations = res.answer.summary;
        // console.log(summaryRecomendations);
      },
      (error: any) => {
        alert(error.message);
      }
    );

    return summaryRecomendations;
  }

  onSelectingYear(event: DropdownChangeEvent) {
    let allYearsData: dataset[] = [];

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
      let years: any = {};

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
                scores.reduce((acc: number, curr: number) => acc + curr, 0) /
                scores.length;
              years[year][month][date] = averageScore.toFixed(2);
            }
          }
        });
      });

      const monthsData: number[][] = [];
      const currentmonth = new Date().getMonth() + 1;
      const today = new Date().getDate();

      for (let month in years[this.currentYear]) {
        const monthValues: number[] = [];

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

      for (let i in monthsData) {
        let color = '#FF9F1C';
        if (i === '0') {
          color = '#c7bebe';
        }

        {
          allYearsData.push({
            label: this.monthsCheck(Number(i)),
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

  onSelectingCategory(event: summaryEvent) {
    // this.categoryLoding = false;
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
  selectedDataFilter(event: string, selectedYear1: number) {
    if (event !== undefined) {
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
  }

  /**graph ploting */
  selectedCategoriGraphData() {
    let month = new Date().getMonth() - 1;

    let summaryResponce: string[] = [];
    let requiredData: number[] = [];
    let bestValueArray: number[] = new Array(month).fill(0);
    let LeastValueArray: number[] = new Array(month).fill(0);

    this.performanceLoader = true;
    // console.log(this.categorieMonthwise[0].label);
    this.sharedservice
      .getsummaryAndRecomendations(this.categorieMonthwise[0].label)
      .subscribe((res: any) => {
        let summary = res.answer.summary;
        setTimeout(() => {
          this.performanceLoader = false;
        }, 1000);
        summaryResponce.push(summary);
      });

    this.categorieMonthwise.forEach((x: categorieMonthwise) => {
      const monthIndex: number = Number(x.month) - 1;

      if (x.avgValue) {
        requiredData[monthIndex] = Number(x.avgValue);
      }
      let bestValue: number;
      let LeastValue: number;

      let removedUndefinedData: number[] = x.categories.filter(
        (x: number | undefined) => x !== undefined
      );

      if (x.avgValue) {
        bestValue = Math.max(...removedUndefinedData);
        LeastValue = Math.min(...removedUndefinedData);
      } else {
        bestValue = 0;
        LeastValue = 0;
      }
      bestValueArray[monthIndex] = bestValue;
      LeastValueArray[monthIndex] = LeastValue;
    });

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
          bestReviews: bestValueArray,
          worstReviews: LeastValueArray,
          summary_Review: summaryResponce,
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

        tooltip: {
          bodyFont: {
            size: 12,
          },
          padding: 8,
          callbacks: {
            label: function (context: any) {
              console.log(context);

              const datasetIndex = context.datasetIndex;
              const value = context.parsed.y;
              const chartData = context.chart.data.datasets[datasetIndex];

              const label = chartData.label;

              return `${label}: ${value}`;
            },
            afterLabel: function (context: any) {
              const dataIndex = context.dataIndex;
              const bestReviews = context.dataset.bestReviews[dataIndex];
              const worstReviews = context.dataset.worstReviews[dataIndex];
              const summary_Review = context.dataset.summary_Review[0];

              return (
                'Best Score: ' +
                bestReviews +
                '\nWorst Score: ' +
                worstReviews +
                '\nsummary_Review: ' +
                summary_Review
              );
            },
          },
        },
        //strats
        // tooltip: {
        //   callbacks: {
        //     title: function (tooltipItems: any, data: any) {
        //       return ''; // Set an empty title, as we are customizing the labels
        //     },
        //     label: function (tooltipItem: any, data: any) {
        //       const datasetIndex = tooltipItem.datasetIndex;
        //       const value = tooltipItem.yLabel;
        //       const label = data.datasets[datasetIndex].label || '';

        //       return `${label}: ${value}`;
        //     },
        //     afterLabel: function (tooltipItem: any, data: any) {
        //       const dataIndex = tooltipItem.index;
        //       const bestReviews = data.datasets[0].bestReviews[dataIndex];
        //       const worstReviews = data.datasets[0].worstReviews[dataIndex];
        //       const summaryReview = data.datasets[0].summaryReview[dataIndex];

        //       return (
        //         'Best Score: ' +
        //         bestReviews +
        //         '\nWorst Score: ' +
        //         worstReviews +
        //         '\nSummary Review: ' +
        //         summaryReview
        //       );
        //     },
        //   },
        // },

        //ends
      },
    };
  }

  LastThreeMonthsData(event: string) {
    if (event !== undefined) {
      const data = this.csvallData();

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
  }

  /**graph ploting for Last 12 month  */
  graphPlotingForLast3Months(dataset: categorieMonthwise[]) {
    let summaryResponce: string[] = [];
    this.performanceLoader = true;
    this.sharedservice
      .getsummaryAndRecomendations(dataset[0].label)
      .subscribe((res: any) => {
        let summary = res.answer.summary;
        setTimeout(() => {
          this.performanceLoader = false;
        }, 1000);
        summaryResponce.push(summary);
      });

    let datasetArr: datasetData[] = [];
    let month: string[] = [];

    let bestValueArray: number[] = [];
    let LeastValueArray: number[] = [];

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
      }
      month.push(this.monthsCheck(Number(dataset[i]['month'])));

      let bestValue: number;
      let LeastValue: number;

      let removedUndefinedData: number[] = dataset[i].categories.filter(
        (x: number | undefined) => x !== undefined
      );

      if (dataset[i].avgValue) {
        bestValue = Math.max(...removedUndefinedData);
        LeastValue = Math.min(...removedUndefinedData);
      } else {
        bestValue = 0;
        LeastValue = 0;
      }
      bestValueArray.push(bestValue);
      LeastValueArray.push(LeastValue);
    }

    console.log(summaryResponce);

    jsonData['data'] = data;
    (jsonData['bestReviews'] = bestValueArray),
      (jsonData['worstReviews'] = LeastValueArray);
    jsonData['summary_Review'] = summaryResponce;

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
        tooltip: {
          bodyFont: {
            size: 12,
          },

          callbacks: {
            label: function (context: any) {
              const datasetIndex = context.datasetIndex;
              const value = context.parsed.y;
              const chartData = context.chart.data.datasets[datasetIndex];

              const label = chartData.label;

              return `${label}: ${value}`;
            },
            afterLabel: function (context: any) {
              console.log(context);

              const dataIndex = context.dataIndex;
              const bestReviews = context.dataset.bestReviews[dataIndex];
              const worstReviews = context.dataset.worstReviews[dataIndex];
              const summary_Review = context.dataset.summary_Review[0];

              return (
                'Best Score: ' +
                bestReviews +
                '\nWorst Score: ' +
                worstReviews +
                '\nsummary_Review: ' +
                summary_Review
              );
            },
          },
        },
      },
    };
  }

  getTrendsCategoriesByWeek() {
    let selectedData = 'week';
    this.sharedservice
      .getTrendsCategoriesByWeek(selectedData)
      .subscribe((res: any) => {
        console.log(res);

        this.TrendsCategoryDetials = res;
      });
  }
}
