import { Component, Input, OnInit } from '@angular/core';
import {
  DropdownChangeEvent,
  ReviewData,
  avgDataForCategories,
  categorieMonthwise,
  datasetData,
  summaryEvent,
} from '../interfaces/categories';
import { SharedService } from 'src/app/shared.service';
import { ApplicationServiceService } from '../application-service.service';
@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.scss'],
})
export class GraphComponentComponent {
  selectedValue: any;
  categoryLoding: any;
  selectedYear: any;
  csvData: any;
  options: any;
  dataa: any;

  @Input() title: string = 'Sentiment Performance'; // Default title

  categorieMonthwise: categorieMonthwise[] = [];
  threeMonthsDataSet: categorieMonthwise[] = [];
  formattedYears: { year: string }[] = [];
  allCategoriesOverTime: any;
  performanceLoader: boolean = false;
  csvRequiredData: any;

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
      (error: any) => {
        console.log(error);
      }
    );
  }

  /** CHNAGING THE DATA ON SELECTING CATEGORY */
  onSelectingCategory(event: summaryEvent) {
    this.categoryLoding = false;
    if (event.value) {
      this.selectedValue = event.value.toUpperCase();
    }

    if (this.selectedYear.year === 'This Year') {
      const currentYear = new Date().getFullYear();
      this.filteringDataBasedOnCategory(this.selectedValue, currentYear);
      this.selectedCategoriGraphData();
    } else if (this.selectedYear.year === 'Last Year') {
      const year = new Date().getFullYear() - 1;
      this.filteringDataBasedOnCategory(this.selectedValue, year);
      this.selectedCategoriGraphData();
    } else {
      this.LastThreeMonthsData(this.selectedValue);
      this.graphPlotingForLast3Months(this.threeMonthsDataSet);
    }
  }

  /** FILTERING THE DATA BASED ON SELECTING CATEGORY */
  filteringDataBasedOnCategory(event: string, selectedYear1: number) {
    if (event !== undefined) {
      const data: any[] = this.csvRequiredData;

      this.categorieMonthwise = data
        ?.filter((x) => x.year === selectedYear1)
        .map((x) => ({
          month: x.month,
          categories: x.categories.map((y: any) => y[event]),
          avgValue: this.average(x.categories.map((y: any) => y?.[event])),
          label: event,
        }));
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

    return Number((sum / removedUndefinedData.length).toFixed(1));
  }

  /**graph ploting for selected Category */
  selectedCategoriGraphData() {
    let month = new Date().getMonth() - 1;

    let summaryResponce: string[] = [];
    let requiredData: number[] = [];
    let bestValueArray: number[] = new Array(month).fill(0);
    let LeastValueArray: number[] = new Array(month).fill(0);

    this.performanceLoader = true;
    this.sharedService
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
          mode: 'nearest',
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
              const summary_Review = context.dataset.summary_Review[0];

              return (
                'Best Score: ' +
                bestReviews +
                '\nWorst Score: ' +
                worstReviews +
                '\nSummary Review: ' +
                summary_Review
              );
            },
          },
        },
      },
    };
  }

  /** To get the last 3 months Data */
  LastThreeMonthsData(event: string) {
    if (event !== undefined) {
      const data = this.csvRequiredData;

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

  /**graph ploting for Last 3 months  */
  graphPlotingForLast3Months(dataset: categorieMonthwise[]) {
    let summaryResponce: string[] = [];
    this.performanceLoader = true;
    this.sharedService
      .getsummaryAndRecomendations(dataset[0].label)
      .subscribe((res: any) => {
        let summary = res.answer.summary;
        setTimeout(() => {
          this.performanceLoader = false;
        }, 500);
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

  /**Filtering data based on years */
  getCategoriesByYear(event: DropdownChangeEvent) {
    if (event.value.year === 'This Year') {
      let currentYear = new Date().getFullYear();
      this.filteringDataBasedOnCategory(this.selectedValue, currentYear);
      this.selectedCategoriGraphData();
    } else if (event.value.year === 'Last Year') {
      let previousYear = new Date().getFullYear() - 1;
      this.filteringDataBasedOnCategory(this.selectedValue, previousYear);
      this.selectedCategoriGraphData();
    } else {
      this.LastThreeMonthsData(this.selectedValue);
      this.graphPlotingForLast3Months(this.threeMonthsDataSet);
    }
  }

  /** TO GET THE ALL CATEGORIES  */
  getAllcatogryData() {
    this.performanceLoader = true;

    this.sharedService.getAllCategories().subscribe(
      (res: any) => {
        // const categoryResponce = res as categoryResponce;
        this.allCategoriesOverTime = res.answer.sort();

        let firstElement = this.allCategoriesOverTime[0];

        let firstElementBody = {
          value: firstElement,
        };

        this.onSelectingCategory(firstElementBody);
      },
      (error: Error) => {
        alert(error.message);
      }
    );
  }

  customizeTooltip() {
    // Get the tooltip element
    let tooltips = document.querySelectorAll('.chartjs-tooltip');

    // Add a custom class to each tooltip element
    tooltips.forEach((tooltip) => {
      tooltip.classList.add('custom-tooltip'); // Add your custom class here
    });
  }
}
