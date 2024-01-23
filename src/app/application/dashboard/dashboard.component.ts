import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as coorddata from '../../../assets/coordinate.json';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  step: number = 2;
  visibleSidebar1!: boolean;
  items: any;
  public TechCat: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.iconMenu();
    this.techDropdown()
  }

  public isActive(base: string): boolean {
    return this.router.url === base;
  }

  techItems:any
  public techDropdown():void {
    this.techItems = [
      { name: 'Tech' },
      { name: 'Technology', code: 'tech' },
      { name: 'Category', code: 'cat' }
  ];
    // this.techItems = [

    //   {
    //     label:'Tech',
    //     icon:'pi pi-database',
    //     items :[
    //       {
    //         label:'Technology',
    //         command: () => {
    //           this.router.navigateByUrl('/admin/technology');
    //         },
    //       },
    //       {
    //         label:'Category',
    //         command: () => {
    //           this.router.navigateByUrl('/admin/category');
    //         },
    //       }
    //     ]
    //   }
    // ]
  }
  public iconMenu(): void {
    this.items = [
      {
        label: 'Action',
        items: [
          {
            label: 'Change Password',
            icon: 'pi pi-key ',
            command: () => {},
          },
          {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
              this.router.navigateByUrl('/admin/profile');
            },
          },
          {
            label: 'Account Settings',
            icon: 'pi pi-cog',
            command: () => {
              this.router.navigateByUrl('/admin/account-settings');
            },
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out mt-0 text-danger',
            command: () => {
              this.onLogout();
            },
          },
        ],
      },
    ];
  }

  // logout
  public onLogout(): void {
    this.router.navigateByUrl('/login');
    localStorage.clear();
  }
}
