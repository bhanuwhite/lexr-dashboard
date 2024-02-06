import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  selectedItem: any;

  constructor() {
    this.selectedItem =
      JSON.parse(sessionStorage.getItem('selectedItem')!) || 'Overview';
  }

  onItemClicked(item: any): void {
    this.selectedItem = item.header;
    sessionStorage.setItem('selectedItem', JSON.stringify(this.selectedItem));
  }
}
