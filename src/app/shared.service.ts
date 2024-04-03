import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  base_url: String = 'https://api.feedback.dataisland.ai';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private headerNamesub = new BehaviorSubject<string>('');
  public headerName$ = this.headerNamesub.asObservable();
  recieveHeaderName(headerName: string) {
    this.headerNamesub.next(headerName);
  }

  public searchAskAnything(body: any) {
    let endPoint = 'askanything';
    const url = `${this.base_url}/${endPoint}`;
    return this.http.post(url, body);
  }

  public getAllCategories() {
    let endPoint = 'allcategories';
    const url = `${this.base_url}/${endPoint}`;
    return this.http.get(url);
  }
  public getsummaryAndRecomendations(item: string) {
    let endPoint = `category_recomendations/?input_category=${item}`;
    const url = `${this.base_url}/${endPoint}`;
    return this.http.get(url);
  }
  public getTrendsCategoriesByWeek(item: string) {
    let endPoint = `average_rating_change_all_categories?groupby=${item}`;
    const url = `${this.base_url}/${endPoint}`;
    return this.http.get(url);
  }

  public getCountryReview(country: string) {
    let endPoint = `get_country_name_review/${country}`;
    const url = `${this.base_url}/${endPoint}`;
    return this.http.get(url);
  }

  public getAllCountriesReview() {
    let endPoint = 'get_country_reviews';
    const url = `${this.base_url}/${endPoint}`;
    return this.http.get(url);
  }

  public getSubCategories(category: any) {
    let endPoint = `get_subcategories?main_category=${category}`;
    const url = `${this.base_url}/${endPoint}`;
    return this.http.get(url);
  }

  errorMessage(message: string) {
    this.toastr.error(message);
    // this.toastr.error('This is an error toast.', 'Error');
  }
}
