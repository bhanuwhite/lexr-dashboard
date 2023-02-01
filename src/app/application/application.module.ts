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
import { MapComponent } from './map/map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
  declarations: [DashboardComponent, MapComponent],
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
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.accessToken, // Optional, can also be set per map (accessToken input of mgl-map)
    }),
  ],
})
export class ApplicationModule {}
