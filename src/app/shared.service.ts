import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // headerName: any;

  constructor() {

  }
  private headerNamesub=new BehaviorSubject<string>('')
  public headerName$=this.headerNamesub.asObservable();
  recieveHeaderName(headerName:string){
     this.headerNamesub.next(headerName);
     console.log(headerName);

  }
}
