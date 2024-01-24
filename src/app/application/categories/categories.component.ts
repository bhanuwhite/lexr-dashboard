import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  data: any;

  options: any;
  dataa: any;
  dataaa: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.dataaa = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['#FF9F1C', '#CB997E', '#CB997E'],
          // hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };
    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'bar',
          label: 'Dataset 1',
          backgroundColor: ['#FF9F1C', '#CB997E', '#CB997E'],
          data: [50, 25, 12, 48, 90, 76, 42]
        },
        {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: ['#FF9F1C', '#CB997E', '#CB997E'],
          data: [21, 84, 24, 75, 37, 65, 34]
        },
        {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: ['#FF9F1C', '#CB997E', '#CB997E'],
          data: [41, 52, 24, 74, 23, 21, 32]
        }
      ]
    };
    this.dataa = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56],
          borderColor: '#FF9F1C',
          borderWidth: 2,
        },
        {
          label: 'My Second Dataset',
          data: [40, 48, 62, 70, 45],
          borderColor: 'grey', // Grey color
          borderWidth: 2,
        },
      ],

    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}