import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastrModule } from 'ngx-toastr';
// import { GMapModule } from 'primeng/gmap';
import { TagModule } from 'primeng/tag';
import { OverlayModule } from 'primeng/overlay';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './application/dashboard/dashboard.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import {
  MapsModule,
  LegendService,
  ZoomService,
} from '@syncfusion/ej2-angular-maps';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    SelectButtonModule,
    ProgressSpinnerModule,
    ToastrModule.forRoot(),
    // GMapModule,
    TagModule,
    LayoutModule,
    OverlayModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        {
          path: 'overview',
          component: DashboardComponent,
          data: { name: 'overView' },
        },
        { path: '**', component: DashboardComponent },
      ],
      {
        useHash: true,
      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
