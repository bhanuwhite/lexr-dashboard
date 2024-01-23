import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  step: number = 2;
  visibleSidebar1!: boolean;
  items: any;
  public TechCat: any;
  data: any;
  cities: any[] = [];
selectedCity: any;

  ngOnInit() {
    
    this.data = {
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
    this.cities = [
      { name: 'All Category', code: 'NY' },
      { name: 'Los Angeles', code: 'LA' },
      { name: 'Chicago', code: 'CH' },
      // Add more cities as needed
  ];
  }
tabstr='overview'
  tabName(str:string){
    this.tabstr = str
  }

}
