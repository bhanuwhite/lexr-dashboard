import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { SharedService } from 'src/app/shared.service';

import { yearsArray } from '../interfaces/dashboard';

import { ApplicationServiceService } from '../application-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
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
  TrendsCategoryDetials: any;
  trendsLoader: boolean = true;

  constructor(
    private sharedservice: SharedService,
    private Route: ActivatedRoute,
    private ApplicationService: ApplicationServiceService
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
  }
  ngOnInit() {
    this.getCsvData();

    this.formattedYears = [
      { year: 'This Year' },
      { year: 'Last Year' },
      { year: 'Last 3 months' },
    ];

    this.getTrendsCategoriesByWeek();
  }

  /** GET CSVdata */
  getCsvData() {
    this.ApplicationService.getAllCsvData().subscribe({
      next: (res: any) => {
        this.csvData = res;

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

          if (this.csvData[i].normalized_country) {
            this.uniqueCountries.add(
              this.csvData[i].normalized_country.toLowerCase()
            );
          }

          this.countryCount = this.uniqueCountries.size;

          console.log(this.countryCount, 'counted Countries');

          if (this.csvData[i].sentiment_score > 0.6) {
            this.possitiveCount++;
          } else if (this.csvData[i].sentiment_score < 0.4) {
            this.negativeCount++;
          } else {
            this.neutral++;
          }
        }
      },
      error: (error: any) => {
        this.sharedservice.errorMessage(error.message);
      },
    });
  }

  getTrendsCategoriesByWeek() {
    let selectedData = 'week';
    this.sharedservice.getTrendsCategoriesByWeek(selectedData).subscribe(
      (res: any) => {
        this.TrendsCategoryDetials = res;
        this.trendsLoader = false;
      },
      (error: any) => {
        this.sharedservice.errorMessage(error.statusText);
        this.trendsLoader = false;
      }
    );
  }
  showAllCategories: boolean = false;

  getTrendsApiKeys() {
    if (this.showAllCategories) {
      return Object.keys(this.TrendsCategoryDetials || '').sort();
    } else {
      return Object.keys(this.TrendsCategoryDetials || '')
        .sort()
        .slice(0, 3);
    }
  }

  toggleCategories() {
    this.showAllCategories = !this.showAllCategories;
  }
}
