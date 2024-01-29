import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TagModule } from 'primeng/tag';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
// import { MapComponent } from './map/map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { CategoriesComponent } from './categories/categories.component';
import { AskAnythingComponent } from './ask-anything/ask-anything.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { YourNeighborsComponent } from './your-neighbors/your-neighbors.component';
import { HeaderComponent } from './header/header.component';
@NgModule({
  declarations: [DashboardComponent, CategoriesComponent, AskAnythingComponent, WorldMapComponent, YourNeighborsComponent, HeaderComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    TagModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    SelectButtonModule,
    FormsModule,
    CalendarModule,
    ChartModule,
    // NgxMapboxGLModule.withConfig({
    //   accessToken: environment.mapbox.accessToken, // Optional, can also be set per map (accessToken input of mgl-map)
    // }),
  ],
})
export class ApplicationModule {}
