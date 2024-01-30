import { Component } from '@angular/core';

@Component({
  selector: 'app-your-neighbors',
  templateUrl: './your-neighbors.component.html',
  styleUrls: ['./your-neighbors.component.scss']
})
export class YourNeighborsComponent {
  data: any;
  baroptions:  any;
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
          // stacked: true,
          grid: {
            display: false, // Hide vertical grid lines
          },
        },
        y: {
          // stacked: true,
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'RotaBlack', // Specify your desired font family here
              // weight: 100,
              // size: 10 // Specify your desired font weight here
            },
          },
        },
      },
    };
  }

}
