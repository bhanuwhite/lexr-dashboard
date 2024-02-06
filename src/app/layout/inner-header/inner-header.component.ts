import { Component, Input, OnInit } from '@angular/core';
import { ROUTES } from '../sidebar/menu-items';
import { SharedService } from 'src/app/shared.service';
ROUTES;

@Component({
  selector: 'app-inner-header',
  templateUrl: './inner-header.component.html',
  styleUrls: ['./inner-header.component.scss']
})
export class InnerHeaderComponent  {
selectedItem: any;
//   overview:any
// sidebarData:any=ROUTES;
constructor(private sharedService:SharedService){
this.sharedService.headerName$.subscribe({
next:(res)=>{
this.selectedItem=res
}

});
}


}

