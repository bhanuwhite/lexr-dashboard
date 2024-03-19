import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { Observable, map } from 'rxjs';
import { ReviewData, avgDataForCategories } from './interfaces/categories';

@Injectable({
  providedIn: 'root',
})
export class ApplicationServiceService {
  constructor(private http: HttpClient) {}

  getAllCsvData(): Observable<any[]> {
    return this.http
      .get('assets/review_with_sentiments.csv', { responseType: 'text' })
      .pipe(map((data: string) => Papa.parse(data, { header: true }).data));
  }

  /** CHANGING THE CSV DATA TO REQUIRED FORMAT */
  csvallData(): Observable<any[]> {
    return this.getAllCsvData().pipe(
      map((res: any[]) => {
        let allYearsData = res.map((x: ReviewData) => {
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
      })
    );
  }

  /** TO GET THE YEAR */
  yearCheck(date: Date) {
    const year = new Date(date).getFullYear();
    return year;
  }

  /** TO GET THE MONTH */
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
}
