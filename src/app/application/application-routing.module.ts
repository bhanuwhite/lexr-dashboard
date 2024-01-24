import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { AskAnythingComponent } from './ask-anything/ask-anything.component';
import { WorldMapComponent } from './world-map/world-map.component';
// import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'askanything',
    component: AskAnythingComponent,
  },
  {
    path: 'worldmap',
    component: WorldMapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
