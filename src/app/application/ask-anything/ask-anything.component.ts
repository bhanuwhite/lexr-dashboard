import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-ask-anything',
  templateUrl: './ask-anything.component.html',
  styleUrls: ['./ask-anything.component.scss'],
})
export class AskAnythingComponent implements OnInit {
  searchedDataResult: string = '';
  constructor(
    private sharedservice: SharedService,
    private Route: ActivatedRoute
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
  }
  ngOnInit(): void {}

  onSearch(event: any) {
    let searchData = event.target.value;

    let body = {
      query: searchData,
    };

    this.sharedservice.searchAskAnything(body).subscribe((res: any) => {
      // console.log(res);

      if (res.status) {
        this.searchedDataResult = res.Answer;
      } else {
        this.searchedDataResult = '';
      }
    });
  }
}
