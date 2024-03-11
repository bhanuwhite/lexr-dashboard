import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  base_url: String = 'https://api.feedback.dataisland.ai';

  constructor(private http: HttpClient) {}

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
}
