import { Component, Input, OnInit } from '@angular/core';
import { ROUTES } from '../sidebar/menu-items';
ROUTES;

@Component({
  selector: 'app-inner-header',
  templateUrl: './inner-header.component.html',
  styleUrls: ['./inner-header.component.scss']
})
export class InnerHeaderComponent implements OnInit {
//   overview:any
// sidebarData:any=ROUTES;


@Input() selectedItem : any;

  ngOnInit(): void {

  }

}
