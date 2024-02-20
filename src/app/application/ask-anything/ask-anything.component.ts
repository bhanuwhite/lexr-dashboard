import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ask-anything',
  templateUrl: './ask-anything.component.html',
  styleUrls: ['./ask-anything.component.scss'],
  providers: [MessageService],
})
export class AskAnythingComponent implements OnInit {
  loading = false;
  loadingSubject = new Subject<boolean>();

  searchedDataResult: string = '';
  constructor(
    private sharedservice: SharedService,
    private messageService: MessageService,
    private Route: ActivatedRoute
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
  }
  ngOnInit(): void {}

  onSearch(event: any) {
    this.loading = true;
    this.loadingSubject.next(true);

    let searchData = event.target.value;

    let body = {
      query: searchData,
    };

    this.sharedservice.searchAskAnything(body).subscribe(
      (res: any) => {
        if (res.status) {
          this.searchedDataResult = res.Answer;
        } else {
          this.searchedDataResult = '';
        }
        this.loading = false;
        this.loadingSubject.next(false);
      },
      (err: any) => {
        // alert(err.message);
        this.searchedDataResult = err.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
        this.loading = false;
        this.loadingSubject.next(false);
      }
    );
  }
}
