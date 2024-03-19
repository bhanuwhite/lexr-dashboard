import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';

import {
  Options,
  categoryResponce,
  datasetData,
  graphData,
  summaryRecomendations,
  yearData,
  yearDataForSentimentGraph,
  years,
  yearsData,
} from '../interfaces/categories';
import { ApplicationServiceService } from '../application-service.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  data!: graphData;
  options!: Options;
  bargraphData!: Options;
  csvData: any;
  yearData: yearData = {};
  summaryRecomendations: summaryRecomendations = {
    summary: '',
    recomendation: [],
  };
  loading: boolean = true;
  formattedYears: years[] = [];
  allYearsData: yearsData = {};
  allCategoriesOverTime: string[] = [];
  statusTrue!: string | number | boolean;
  private myChart: ECharts | null = null;

  selectedYear: years = {
    year: '',
  };
  summaryData: any;
  csvRequiredData: any;
  doughnutChartLoader: boolean = false;

  constructor(
    private sharedservice: SharedService,
    private Route: ActivatedRoute,
    private changeDetection: ChangeDetectorRef,
    private ApplicationService: ApplicationServiceService
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
  }
  ngOnInit(): void {
    this.getCsvData();

    this.getAllcatogryData();

    this.formattedYears = [
      { year: 'This Year' },
      { year: 'Last Year' },
      { year: 'Last 3 months' },
    ];
  }

  /**To Get All the CSV data */
  getCsvData() {
    let years: any = {};

    this.ApplicationService.getAllCsvData().subscribe(
      (res) => {
        this.csvData = res;
        this.csvData.forEach((each: any) => {
          const year = new Date(each.date).getFullYear();
          const month = new Date(each.date).getMonth() + 1;
          const sentimentScore = parseFloat(each.sentiment_score);

          // Check if the year exists in the years object
          if (sentimentScore !== 0) {
            if (!years[year]) {
              years[year] = {};
            }
            if (!years[year][month]) {
              years[year][month] = {
                positiveReview: 0,
                negativeReview: 0,
                bestReview: 0,
                worstReview: 1,
              };
            }
            if (sentimentScore > 0.6) {
              years[year][month].positiveReview++;
            } else if (sentimentScore < 0.4) {
              years[year][month].negativeReview++;
            }
            if (years[year][month].bestReview < sentimentScore) {
              years[year][month].bestReview = sentimentScore;
            }
            if (years[year][month].worstReview > sentimentScore) {
              years[year][month].worstReview = sentimentScore;
            }
          }
        });

        this.allYearsData = years;

        for (let year in years) {
          this.yearData[year] = {
            possitiveReviewData: Array(12).fill(0),
            negativeReviewData: Array(12).fill(0),
            BestReview: Array(12).fill(0),
            LeastReview: Array(12).fill(0),
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
              if (years[year][month].bestReview) {
                this.yearData[year].BestReview[parseInt(month) - 1] =
                  years[year][month].bestReview;
              }
              if (years[year][month].worstReview) {
                this.yearData[year].LeastReview[parseInt(month) - 1] =
                  years[year][month].worstReview;
              }
            }
          }
        }

        let event = {
          value: { year: 'This Year' },
        };
        this.getJsonObjectData();
        this.getByYearData(event);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  /**Returns the required csvdata for graph ploting*/
  getJsonObjectData(): void {
    this.ApplicationService.csvallData().subscribe(
      (data: any[]) => {
        this.csvRequiredData = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  /** get the data to selected Years for Sentiment Performance graph*/
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
      this.graphPlotingForYears(Selectedyear);
    } else {
      this.graphPlotingForMonths();
    }
  }

  /**Graph ploting for the Years */
  graphPlotingForYears(Selectedyear: number) {
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
              worstReviews: this.yearData[Selectedyear].LeastReview,
              bestReviews: this.yearData[Selectedyear].BestReview,
            });
          }
          if (i === 'negativeReviewData') {
            requiredData.push({
              type: 'bar',
              label: 'Negative Review',
              backgroundColor: ['#CB997E'],
              data: this.yearData[Selectedyear][i],
              worstReviews: this.yearData[Selectedyear].LeastReview,
              bestReviews: this.yearData[Selectedyear].BestReview,
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
        tooltip: {
          bodyFont: {
            size: 12,
            padding: 15,
          },
          padding: 15,
          callbacks: {
            label: function (context: any) {
              const dataIndex = context.dataIndex;
              const datasetIndex = context.datasetIndex;
              const value = context.parsed.y;
              const chartData = context.chart.data.datasets[datasetIndex];
              const label = chartData.label;

              return label + ': ' + value;
            },
            afterLabel: function (context: any) {
              const dataIndex = context.dataIndex;
              const datasetIndex = context.datasetIndex;
              const bestReviews = context.dataset.bestReviews[dataIndex];
              const worstReviews = context.dataset.worstReviews[dataIndex];

              return (
                'Best Score: ' + bestReviews + '\nWorst Score: ' + worstReviews
              );
            },
          },
        },
      },
    };
  }

  /**Graph ploting for the Months */

  graphPlotingForMonths() {
    let requiredData: any[] = [];
    let currentYear = new Date().getFullYear();
    let currentmonth = new Date().getMonth();
    let LastThreeMonthsDataForReview: any[] = [];

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
              bestReview: this.allYearsData[currentYear][x].bestReview,
              worstReview: this.allYearsData[currentYear][x].worstReview,
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
                bestReview: this.allYearsData[currentYear - 1][x].bestReview,
                worstReview: this.allYearsData[currentYear - 1][x].worstReview,
              });
              monthsAdded++;
            }
          }
        }
      }
    }

    let positiveData = [];
    let negativeData = [];
    let bestReview = [];
    let LeastReview = [];
    let months = [];

    for (let i = 0; i < LastThreeMonthsDataForReview.length; i++) {
      for (let item in LastThreeMonthsDataForReview[i]) {
        if (item === 'negativeReviewData') {
          negativeData.push(LastThreeMonthsDataForReview[i][item]);
        } else if (item === 'possitiveReviewData') {
          positiveData.push(LastThreeMonthsDataForReview[i][item]);
        } else if (item === 'month') {
          months.push(this.monthsCheck(LastThreeMonthsDataForReview[i][item]));
          LeastReview.push(LastThreeMonthsDataForReview[i].worstReview);
          bestReview.push(LastThreeMonthsDataForReview[i].bestReview);
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
          worstReviews: LeastReview,
          bestReviews: bestReview,
        });
      }
      if (item === 'negativeReview') {
        requiredData.push({
          type: 'bar',
          label: 'Negative Review',
          backgroundColor: ['#CB997E'],
          data: dataArray[item],
          borderWidth: 0.2,
          worstReviews: LeastReview,
          bestReviews: bestReview,
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
        tooltip: {
          bodyFont: {
            size: 12,
            padding: 15,
          },
          padding: 15,
          callbacks: {
            label: function (context: any) {
              const dataIndex = context.dataIndex;
              const datasetIndex = context.datasetIndex;
              const value = context.parsed.y;
              const chartData = context.chart.data.datasets[datasetIndex];
              const label = chartData.label;

              return label + ': ' + value;
            },
            afterLabel: function (context: any) {
              const dataIndex = context.dataIndex;
              const datasetIndex = context.datasetIndex;
              const bestReviews = context.dataset.bestReviews[dataIndex];
              const worstReviews = context.dataset.worstReviews[dataIndex];

              return (
                'Best Score: ' + bestReviews + '\nWorst Score: ' + worstReviews
              );
            },
          },
        },
      },
    };
  }

  /**get getAllcatogryData data */
  getAllcatogryData() {
    this.doughnutChartLoader = true;
    this.sharedservice.getAllCategories().subscribe(
      (res: any) => {
        const categoryResponce = res as categoryResponce;
        this.allCategoriesOverTime = categoryResponce.answer.sort();

        this.doughnutChartLoader = false;
        let firstElement = this.allCategoriesOverTime[0];

        let firstElementBody = {
          value: firstElement,
        };

        this.getsummaryAndRecomendations(firstElementBody);
        this.graphDataForDoghnutChart();
        this.InitPipe();
      },
      (error: Error) => {
        alert(error.message);
      }
    );
  }

  /**get Summary and Reccommendation Data*/
  getsummaryAndRecomendations(event: any) {
    this.loading = true;

    let selectedValue: string = '';
    if (event.value) {
      selectedValue = event.value;
    }

    this.sharedservice.getsummaryAndRecomendations(selectedValue).subscribe(
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

  /**Returns the month Name*/
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

  graphDataForDoghnutChart() {
    const data: any[] = this.csvRequiredData;

    let result: any[] = [];

    this.allCategoriesOverTime.forEach((element) => {
      let count = 0;
      let bestReview = 0;
      let worstReview = 1;
      let summaryReccommendation = '';
      data.forEach((x) => {
        x.categories.forEach((y: any) => {
          if (Object.keys(y).includes(element.toUpperCase())) {
            count++;
          }

          let selectedelement = element.toUpperCase();

          const value = y[selectedelement];

          if (value !== undefined) {
            if (value > bestReview) {
              bestReview = value;
            }
            if (worstReview > value) {
              worstReview = value;
            }
          }
        });
      });
      this.changeDetection.detectChanges();

      result.push({
        name: element,
        value: count,
        BestReview: bestReview,
        WorstReview: worstReview,
        summaryReccommendation: summaryReccommendation,
      });
      this.changeDetection.detectChanges();
    });

    return result;
  }

  private InitPipe(): void {
    this.myChart = echarts.init(document.getElementById('pieChart') as any);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const { name, value, percent, data } = params;

          const bestReview = data.BestReview;
          const worstReview = data.WorstReview;
          // let summaryReccommendation = data.summaryReccommendation;
          this.changeDetection.detectChanges();

          let displayData;
          if (data.loading) {
            displayData = `
              <div style="display: flex; flex-direction: column; width:auto;">
                <div>${name}: ${value} (${percent}%)</div>
                <div>Best Score: ${bestReview}</div>
                <div>Worst Score: ${worstReview}</div>
                <div style="width: 500px; min-height: 100px; word-break: auto-phrase; -webkit-box-orient: vertical; -webkit-line-clamp: 3; white-space: pre-wrap;">
                  <p class="summary-review-report" >Summary Review: Loading..</p>
                </div>
              </div>
            `;
          } else {
            displayData = `
              <div style="display: flex; flex-direction: column; width:auto;">
                <div>${name}: ${value} (${percent}%)</div>
                <div>Best Score: ${bestReview}</div>
                <div>Worst Score: ${worstReview}</div>
                <div style="width: 500px; min-height: 100px; word-break: auto-phrase; -webkit-box-orient: vertical; -webkit-line-clamp: 3; white-space: pre-wrap;">
                  <p class="summary-review-report" >Summary Review: ${data.summaryReccommendation}</p>
                </div>
              </div>
            `;
          }

          return displayData;
        },
      },

      legend: {
        show: false,
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
          data: this.graphDataForDoghnutChart(),
        },
      ],
    };
    // this.myChart.setOption(option);

    this.myChart
      .on('mouseover', (data: any) => {
        data.data.loading = true;
        let element = data.data.name;

        this.sharedservice.getsummaryAndRecomendations(element).subscribe(
          (res: any) => {
            this.summaryData = res.answer.summary;
            data.data.loading = false;
            data.data.summaryReccommendation = this.summaryData;

            if (this.myChart) {
              this.myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: data.dataIndex,
                position: 'left',
              });
            }
            this.changeDetection.detectChanges();
          },
          (error: any) => {
            this.statusTrue = error.status;
            this.loading = false;
          }
        );
      })
      .setOption(option);
  }
}
