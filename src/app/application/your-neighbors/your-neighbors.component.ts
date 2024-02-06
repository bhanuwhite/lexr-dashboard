import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-your-neighbors',
  templateUrl: './your-neighbors.component.html',
  styleUrls: ['./your-neighbors.component.scss']
})
export class YourNeighborsComponent {
  data: any;
  baroptions:  any;



  constructor(private sharedservice:SharedService,private Route:ActivatedRoute){

    this.Route.data.subscribe((res)=>{
    this.sharedservice.recieveHeaderName(res['name'])
    })

      }

  ngOnInit() {
    this.data = {
      labels: ['Restaurant',],
      datasets: [
        {
          type: 'bar',
          label: 'You',
          backgroundColor: ['#FF9F1C'],
          data: [50, 25, ],
        },
        {
          type: 'bar',
          label: 'Them',
          backgroundColor: ['#CB997E'],
          data: [21, 84, ],
        },
      ],
    };
    this.baroptions = {
      scales: {
        x: {
          grid: {
            display: false,
          },
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'RotaBlack',
            },
          },
        },
      },
    };
  }

}
