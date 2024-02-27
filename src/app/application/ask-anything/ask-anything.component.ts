import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-ask-anything',
  templateUrl: './ask-anything.component.html',
  styleUrls: ['./ask-anything.component.scss'],
  providers: [MessageService, BnNgIdleService],
})
export class AskAnythingComponent implements OnInit {
  searchControl: FormControl = new FormControl('');

  questionAnswerArray: any[] = [];
  question: string = '';
  loading = false;
  loadingSubject = new Subject<boolean>();
  searchedDataResult: string = '';

  constructor(
    private sharedservice: SharedService,
    private messageService: MessageService,
    private Route: ActivatedRoute,
    private bnIdle: BnNgIdleService,
    private router: Router
  ) {
    this.Route.data.subscribe((res) => {
      this.sharedservice.recieveHeaderName(res['name']);
    });
  }

  ngOnInit(): void {
    if (performance.navigation.type === 1) {
      localStorage.setItem('isPageRefreshed', 'true');
    }

    this.bnIdle.startWatching(20 * 60 * 60).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        alert(isTimedOut);
        this.bnIdle.stopTimer();
      }
    });
  }

  onSearch(event: any) {
    this.loading = true;

    const isPageRefreshed = localStorage.getItem('isPageRefreshed');

    if (isPageRefreshed) {
      localStorage.removeItem('isPageRefreshed');

      let body = {
        query: event.target.value,
        time_flag: true,
      };
      this.searchAskAnything(body);
    } else {
      let body = {
        query: event.target.value,
        time_flag: false,
      };

      this.searchAskAnything(body);
    }
  }

  private searchAskAnything(body: any) {
    console.log(body);

    this.sharedservice.searchAskAnything(body).subscribe(
      (res: any) => {
        this.questionAnswerArray.unshift({
          Question: res.question,
          Answer: res.answer
            .replace(/<h2>/g, '<h5 class="custom-h2"">')
            .replace(/<\/h2>/g, '</h5>'),
        });

        this.searchControl.reset();

        this.loading = false;
      },
      (err: any) => {
        this.searchedDataResult = err.message;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
        this.loading = false;
        this.loadingSubject.next(false);
        this.searchControl.reset();
      }
    );
  }
}
