import { Component, Input, OnInit } from '@angular/core';
import {
  DropdownChangeEvent,
  categorieMonthwise,
  datasetData,
  summaryEvent,
} from '../interfaces/categories';
import { SharedService } from 'src/app/shared.service';
import { ApplicationServiceService } from '../application-service.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.scss'],
})
export class GraphComponentComponent implements OnInit {
  selectedValue: any;
  selectedCategory: any;
  categoryLoding: any;
  selectedYear: any;
  csvData: any;
  options: any;
  dataa: any;
  summaryError: boolean = false;

  @Input() Name: string = 'Sentiment Performance'; // Default title

  categorieMonthwise: categorieMonthwise[] = [];
  threeMonthsDataSet: categorieMonthwise[] = [];
  formattedYears: { year: string }[] = [];
  allCategoriesOverTime: any;
  performanceLoader: boolean = false;
  csvRequiredData: any;
  chartInstance!: Chart;
  summaryCategory: any;
  constructor(
    private sharedService: SharedService,
    private ApplicationService: ApplicationServiceService
  ) {}

  ngOnInit(): void {
    this.getCsvData();

    this.formattedYears = [
      { year: 'This Year' },
      { year: 'Last Year' },
      { year: 'Last 3 months' },
    ];
    this.getAllcatogryData();
  }
  /** GET ALL CSV DATA */
  getCsvData() {
    this.ApplicationService.getAllCsvData().subscribe((res) => {
      this.csvData = res;
    });
    this.getJsonObjectData();
  }

  getJsonObjectData(): void {
    this.ApplicationService.csvallData().subscribe(
      (data: any[]) => {
        this.csvRequiredData = data;
      },
      (error: any) => {}
    );
  }

  /** CHNAGING THE DATA ON SELECTING CATEGORY */
  onSelectingCategory(event: summaryEvent) {
    this.categoryLoding = false;
    if (event.value) {
      this.selectedValue = event.value.toUpperCase();
      this.selectedCategory = event.value;
    }

    if (this.selectedYear?.year === 'This Year') {
      const currentYear = new Date().getFullYear();
      this.filteringDataBasedOnCategory(this.selectedValue, currentYear);
    } else if (this.selectedYear?.year === 'Last Year') {
      const year = new Date().getFullYear() - 1;
      this.filteringDataBasedOnCategory(this.selectedValue, year);
    } else {
      this.LastThreeMonthsData(this.selectedValue);
    }
  }

  /** FILTERING THE DATA BASED ON SELECTING CATEGORY */
  filteringDataBasedOnCategory(event: string, selectedYear1: number) {
    if (event !== undefined) {
      const data: any[] = this.csvRequiredData;

      let filteredcategorieMonthwise: any[] = [];

      this.sharedService.getSubCategories(this.selectedCategory).subscribe({
        next: (res: any) => {
          res.forEach((i: any) => {
            let categoryReplaced = i.replace(/_/g, ' ');
            data
              ?.filter((x: any) => x.year === selectedYear1)
              .map((x: any) =>
                filteredcategorieMonthwise.push({
                  month: x.month,
                  categories: x.categories.map(
                    (y: any) => y[categoryReplaced.toUpperCase()]
                  ),
                  label: i,
                })
              );
          });

          const aggregatedData: any = {};

          filteredcategorieMonthwise.forEach((item) => {
            const month = item.month;
            const categories = item.categories;

            if (!aggregatedData[month]) {
              aggregatedData[month] = {
                month: month,
                avgValue: [],
                categories: [],
                label: item.label,
              };
            }

            aggregatedData[month].categories =
              aggregatedData[month].categories.concat(categories);
          });

          const result = Object.values(aggregatedData);

          result.forEach((item: any) => {
            let removedUndefinedData: number[] = item.categories.filter(
              (x: number | undefined) => x !== undefined
            );
            if (removedUndefinedData.length > 0) {
              const sum = removedUndefinedData.reduce(
                (acc: any, val: any) => acc + val,
                0
              );
              item.avgValue = (
                (sum / removedUndefinedData.length) *
                100
              ).toFixed(1);
            } else {
              item.avgValue = NaN;
            }
          });

          this.selectedCategoriGraphData(result);
        },
        error: (err: any) => {
          this.sharedService.errorMessage(err.message);
          this.summaryError = true;
        },
      });
    }
  }

  /** calculate Average */
  average(data: number[]) {
    let sum = 0;
    let removedUndefinedData: number[] = data.filter(
      (x: number | undefined) => x !== undefined
    );

    if (removedUndefinedData) {
      for (let i = 0; i < removedUndefinedData.length; i++) {
        sum += Number(removedUndefinedData[i]);
      }
    }

    return Number((sum / removedUndefinedData.length).toFixed(1)) * 100;
  }

  selectedCategoriGraphData(data: any) {
    let apiCallMadeForElement: any[] = [];
    let activeRequests: any = [];
    let month = new Date().getMonth() - 1;

    let requiredData: number[] = [];
    let bestValueArray: number[] = new Array(month).fill(0);
    let LeastValueArray: number[] = new Array(month).fill(0);

    data?.forEach((x: categorieMonthwise) => {
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
    let final_Data: any[] = [];
    for (let i = 0; i < requiredData.length; i++) {
      if (requiredData[i]) {
        final_Data.push({ x: this.monthsCheck(i + 1), y: requiredData[i] });
      }
    }

    this.dataa = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'April',
        'May',
        'June',
        'July',
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
          data: final_Data,
          bestReviews: bestValueArray,
          worstReviews: LeastValueArray,
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
          max: 100,
          ticks: {
            stepSize: 10,
            callback: function (value: any, index: number, values: any) {
              return value.toFixed(0);
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
              const CategorySummary = 'Loading';
              return (
                'Best Score: ' +
                bestReviews +
                '\nWorst Score: ' +
                worstReviews +
                '\nSummary :' +
                CategorySummary
              );
            },
          },
        },
      },
      interaction: {
        mode: 'point',
      },
      onHover: (event: any, chartElement: any) => {
        let summaryCountry = '';

        if (chartElement && chartElement.length > 0) {
          const dataIndex = chartElement[0].index;
          const selectedCategory = this.selectedCategory;

          let localStorageData = localStorage.getItem(selectedCategory);

          if (!localStorageData) {
            const request = this.sharedService
              .getsummaryAndRecomendations(selectedCategory)
              .subscribe({
                next: (res: any) => {
                  summaryCountry = res.answer.summary;
                  apiCallMadeForElement[dataIndex] = true;

                  localStorage.setItem(selectedCategory, summaryCountry);

                  const datasetIndex = chartElement[0].datasetIndex;
                  const chartInstance = event.chart;

                  if (chartInstance && chartInstance.tooltip) {
                    chartInstance.tooltip.setActiveElements(chartElement);
                    chartInstance.tooltip.options.callbacks.afterLabel = (
                      context: any
                    ) => {
                      return (
                        'Best Score: ' +
                        context.dataset.bestReviews[dataIndex] +
                        '\nWorst Score: ' +
                        context.dataset.worstReviews[dataIndex] +
                        '\nSummary Review: ' +
                        summaryCountry
                      );
                    };
                    chartInstance.update();
                    chartInstance.tooltip.update(); // Update tooltip
                  }
                },
                error: (err: any) => {},
                complete: () => {
                  activeRequests[dataIndex] = null;
                },
              });
            activeRequests[dataIndex] = request;
          } else {
            const chartInstance = event.chart;
            if (chartInstance && chartInstance.tooltip) {
              chartInstance.tooltip.setActiveElements(chartElement);
              chartInstance.tooltip.options.callbacks.afterLabel = (
                context: any
              ) => {
                return (
                  'Best Score: ' +
                  context.dataset.bestReviews[dataIndex] +
                  '\nWorst Score: ' +
                  context.dataset.worstReviews[dataIndex] +
                  '\nSummary Review: ' +
                  localStorageData
                );
              };
              chartInstance.update();
              chartInstance.tooltip.update(); // Update tooltip
            }
          }
        }
      },
    };
  }

  LastThreeMonthsData(event: string) {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth(); //giving prevoius month Number
    let LastThreeMonthsDataForReview: any[] = [];
    let filteredcategorieMonthWise: any[] = [];

    const data = this.csvRequiredData;
    this.sharedService
      .getSubCategories(this.selectedCategory)
      .subscribe((res: any) => {
        res.forEach((i: any) => {
          let categoryReplaced = i.replace(/_/g, ' ');
          data
            ?.filter(
              (x: any) => x.year === currentYear - 1 || x.year === currentYear
            )
            .map((x: any) =>
              filteredcategorieMonthWise.push({
                year: x.year,
                month: x.month,
                categories: x.categories.map(
                  (y: any) => y[categoryReplaced.toUpperCase()]
                ),
                label: event,
              })
            );
        });
        const aggregatedData: any = {};

        filteredcategorieMonthWise.forEach((item: any) => {
          const year = item.year;
          const month = item.month;
          const categories = item.categories;

          const key = `${year}-${month}`;

          if (!aggregatedData[key]) {
            aggregatedData[key] = {
              year: year,
              month: month,
              avgValue: [],
              categories: [],
              label: item.label,
            };
          }

          aggregatedData[key].categories =
            aggregatedData[key].categories.concat(categories);
        });

        const result: any = Object.values(aggregatedData);

        result.forEach((item: any) => {
          let removedUndefinedData: number[] = item.categories.filter(
            (x: number | undefined) => x !== undefined
          );
          if (removedUndefinedData.length > 0) {
            const sum = removedUndefinedData.reduce(
              (acc: any, val: any) => acc + val,
              0
            );
            item.avgValue = ((sum / removedUndefinedData.length) * 100).toFixed(
              1
            );
          } else {
            item.avgValue = NaN;
          }
        });

        let monthsAdded = 0;
        for (let i = currentMonth; i > 0 && monthsAdded < 3; i--) {
          let foundData = result.find(
            (x: any) => x.year === currentYear && Number(x.month) === i
          );
          if (!foundData) {
            foundData = {
              year: currentYear,
              month: i.toString(),
              categories: [],
            };
          }
          LastThreeMonthsDataForReview.unshift({
            month: i,
            categories: foundData.categories,
            avgValue: foundData.avgValue,
            label: event,
          });
          monthsAdded++;
        }

        if (monthsAdded < 3) {
          for (let i = 12; i > 0 && monthsAdded < 3; i--) {
            let foundData = filteredcategorieMonthWise.find(
              (x: any) => x.year === currentYear - 1 && Number(x.month) === i
            );
            if (!foundData) {
              foundData = {
                year: currentYear - 1,
                month: i.toString(),
                categories: [],
              };
            }
            LastThreeMonthsDataForReview.unshift({
              month: i,
              categories: foundData.categories,
              avgValue: foundData.avgValue,
              label: event,
            });
            monthsAdded++;
          }
        }

        this.graphPlotingForLast3Months(LastThreeMonthsDataForReview);
      });
  }

  /**To get the month number */
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
        return 'Sep';
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
  /**graph ploting for Last 3 months  */
  graphPlotingForLast3Months(dataset: categorieMonthwise[]) {
    let apiCallMadeForElement: any[] = [];
    let activeRequests: any = [];
    let summaryResponce: string[] = [];

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

    for (let i = 0; i < dataset.length; i++) {
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
          max: 100,
          ticks: {
            stepSize: 10,
            callback: function (value: any, index: number, values: any) {
              return value.toFixed(0);
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
              const dataIndex = context.dataIndex;
              const bestReviews = context.dataset.bestReviews[dataIndex];
              const worstReviews = context.dataset.worstReviews[dataIndex];

              return (
                'Best Score: ' +
                bestReviews +
                '\nWorst Score: ' +
                worstReviews +
                '\nSummary : ' +
                'CategorySummary'
              );
            },
          },
        },
      },
      interaction: {
        mode: 'point',
      },
      onHover: (event: any, chartElement: any) => {
        let summaryCountry = '';
        if (chartElement && chartElement.length > 0) {
          const dataIndex = chartElement[0].index;
          if (!apiCallMadeForElement[dataIndex]) {
            const selectedCategory = this.selectedCategory;
            activeRequests[dataIndex]?.unsubscribe();
            let localStorageData = localStorage.getItem(selectedCategory);

            if (!localStorageData) {
              const request = this.sharedService
                .getsummaryAndRecomendations(selectedCategory)
                .subscribe({
                  next: (res: any) => {
                    summaryCountry = res.answer.summary;
                    apiCallMadeForElement[dataIndex] = true;

                    localStorage.setItem(selectedCategory, summaryCountry);

                    const datasetIndex = chartElement[0].datasetIndex;
                    const chartInstance = event.chart;
                    if (chartInstance && chartInstance.tooltip) {
                      chartInstance.tooltip.setActiveElements(chartElement);
                      chartInstance.tooltip.options.callbacks.afterLabel = (
                        context: any
                      ) => {
                        return (
                          'Best Score: ' +
                          context.dataset.bestReviews[dataIndex] +
                          '\nWorst Score: ' +
                          context.dataset.worstReviews[dataIndex] +
                          '\nSummary Review: ' +
                          summaryCountry
                        );
                      };
                      chartInstance.update();
                      chartInstance.tooltip.update();
                    }
                  },
                  error: (err: any) => {},
                  complete: () => {
                    activeRequests[dataIndex] = null;
                  },
                });
              activeRequests[dataIndex] = request;
            } else {
              const datasetIndex = chartElement[0].datasetIndex;
              const chartInstance = event.chart;
              if (chartInstance && chartInstance.tooltip) {
                chartInstance.tooltip.setActiveElements(chartElement);
                chartInstance.tooltip.options.callbacks.afterLabel = (
                  context: any
                ) => {
                  return (
                    'Best Score: ' +
                    context.dataset.bestReviews[dataIndex] +
                    '\nWorst Score: ' +
                    context.dataset.worstReviews[dataIndex] +
                    '\nSummary Review: ' +
                    localStorageData
                  );
                };
                chartInstance.update();
                chartInstance.tooltip.update();
              }
            }
          } else {
          }
        }
      },
    };
  }

  /**Filtering data based on years */
  getCategoriesByYear(event: DropdownChangeEvent) {
    if (event.value.year === 'This Year') {
      let currentYear = new Date().getFullYear();
      this.filteringDataBasedOnCategory(this.selectedValue, currentYear);
    } else if (event.value.year === 'Last Year') {
      let previousYear = new Date().getFullYear() - 1;
      this.filteringDataBasedOnCategory(this.selectedValue, previousYear);
    } else {
      this.LastThreeMonthsData(this.selectedValue);
    }
  }

  /** TO GET THE ALL CATEGORIES  */
  getAllcatogryData() {
    this.sharedService.getAllCategories().subscribe(
      (res: any) => {
        this.allCategoriesOverTime = res.answer.sort();

        let firstElement = this.allCategoriesOverTime[0];

        let firstElementBody = {
          value: firstElement,
        };

        this.onSelectingCategory(firstElementBody);
      },
      (error: Error) => {
        this.summaryError = true;
        this.sharedService.errorMessage(error.message);
      }
    );
  }
}
