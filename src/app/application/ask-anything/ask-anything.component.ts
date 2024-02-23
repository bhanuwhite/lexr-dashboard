import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ask-anything',
  templateUrl: './ask-anything.component.html',
  styleUrls: ['./ask-anything.component.scss'],
  providers: [MessageService],
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
    this.question = searchData;

    let body = {
      query: searchData,
    };

    this.sharedservice.searchAskAnything(body).subscribe(
      (res: any) => {
        this.questionAnswerArray.unshift({
          Question: res.question,
          Answer: res.answer
            .replace(/<h2>/g, '<h5 class="custom-h2"">')
            .replace(/<\/h2>/g, '</h5>'),
        });
        console.log(this.questionAnswerArray);

        // this.questionAnswerArray = this.questionAnswerArray.reverse();
        this.searchControl.reset();

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
        this.searchControl.reset();
      }
    );
  }
}
