import { Component } from '@angular/core';

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

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.dataaa = {
      labels: [
        ' Number of reviews per category ',
      ],
      datasets: [
        {
          data: [200, 50, 100, 70],
          backgroundColor: ['#FF9F1C', '#CB997E', '#AF9455', '#FFBF69'],
          // hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
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
            display: false, // Hide vertical grid lines
          },
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
    this.baroptions = {
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false, // Hide vertical grid lines
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
              family: 'RotaBlack', // Specify your desired font family here
              // weight: 100,
              // size: 10 // Specify your desired font weight here
            },
          },
        },
      },
    };
    this.optionss = {
      cutout: '85%', // Adjust this value to set the gap between the data points
      elements: {
        arc: {
          borderWidth: 7,
          borderRadius: 10, // Adjust this value to make the doughnut more rounded
        }
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
