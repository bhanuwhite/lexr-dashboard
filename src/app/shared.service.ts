import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // headerName: any;

  base_url: String = 'http://139.59.39.115:5000';

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
}
