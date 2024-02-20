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
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { CategoriesComponent } from './categories/categories.component';
import { AskAnythingComponent } from './ask-anything/ask-anything.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { YourNeighborsComponent } from './your-neighbors/your-neighbors.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ScrollerModule } from 'primeng/scroller';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    DashboardComponent,
    CategoriesComponent,
    AskAnythingComponent,
    WorldMapComponent,
    YourNeighborsComponent,
  ],
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
    ProgressSpinnerModule,
    ToastModule,
    ScrollerModule,
    DividerModule,
  ],
})
export class ApplicationModule {}
