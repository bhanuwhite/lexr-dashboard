import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-ask-anything',
  templateUrl: './ask-anything.component.html',
  styleUrls: ['./ask-anything.component.scss']
})
export class AskAnythingComponent {

  constructor(private sharedservice:SharedService,private Route:ActivatedRoute){

    this.Route.data.subscribe((res)=>{
    this.sharedservice.recieveHeaderName(res['name'])
    })

      }
}
