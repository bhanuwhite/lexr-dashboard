import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
  selectedItem :any ;

  constructor() {
    this.selectedItem = JSON.parse(sessionStorage.getItem('selectedItem')!) ||  'Overview';
  }


  onItemClicked(item: any): void {
    console.log('Item clicked in LayoutComponent:', item);
this.selectedItem =item.header;
console.log(this.selectedItem );

sessionStorage.setItem('selectedItem', JSON.stringify(this.selectedItem) )

  }
}
