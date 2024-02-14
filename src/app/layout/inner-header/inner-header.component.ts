import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ROUTES } from '../sidebar/menu-items';
import { SharedService } from 'src/app/shared.service';

import { ActivatedRoute } from '@angular/router';

ROUTES;

@Component({
  selector: 'app-inner-header',
  templateUrl: './inner-header.component.html',
  styleUrls: ['./inner-header.component.scss']
})
export class InnerHeaderComponent {
  sidebarData: any = ROUTES;
  step: number = 2;
  sidebarVisible1: boolean = false;
  selectedItem: any;
  
  constructor(private route: ActivatedRoute, private sharedService: SharedService) {
    this.sharedService.headerName$.subscribe({
      next: (res) => {
        this.selectedItem = res
      }
    });
  }

  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();
  
  toggleDropdown(item: any): void {
    this.itemClicked.emit(item);
  }
}
