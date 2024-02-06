import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogarithmicScale } from 'chart.js';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  data: any;

  options: any;
  dataa: any;
  dataaa: any;
  optionss: any;
  optionsss: any;
  baroptions: any;

  constructor(private sharedservice:SharedService,private Route:ActivatedRoute){

this.Route.data.subscribe((res)=>{
this.sharedservice.recieveHeaderName(res['name'])
})

  }

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.dataaa = {
      labels: [
        'Best comment',
        'Worst comment',
        'Summary comment',
        'Average sentiment score',
      ],
      datasets: [
        {
          data: [200, 50, 100, 70],
          backgroundColor: ['#FF9F1C', '#CB997E', '#AF9455', '#FFBF69'],
        },
      ],
    };

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'bar',
          label: 'Positive Review',
          backgroundColor: ['#FF9F1C'],
          data: [50, 25, 12, 48, 90, 76, 42],
        },
        {
          type: 'bar',
          label: 'Negative Review',
          backgroundColor: ['#CB997E'],
          data: [21, 84, 24, 75, 37, 65, 34],
        },
      ],
    };
    this.dataa = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Current Year',
          backgroundColor: ['#FF9F1C'],
          data: [65, 80, 55, 75, 56, 90, 40],
          borderColor: '#FF9F1C',
          borderWidth: 2,
          lineTension: 0.5,
        },
        {
          label: 'Last Year',
          data: [40, 65, 30, 70, 20, 80, 16],
          backgroundColor: ['#c7bebe'],
          borderColor: '#c7bebe', // Grey color
          borderWidth: 2,
          lineTension: 0.5,
        },
      ],
    };

    this.optionsss = {
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
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

    this.baroptions = {
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
        },
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
    this.optionss = {
      cutout: '85%',
      elements: {
        arc: {
          borderRadius: 10,
        },
      },

      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
