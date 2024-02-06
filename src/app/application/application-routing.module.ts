import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { AskAnythingComponent } from './ask-anything/ask-anything.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { YourNeighborsComponent } from './your-neighbors/your-neighbors.component';
// import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data:{name:'overView'}
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    data:{name:'Categories'}
  },
  {
    path: 'askanything',
    component: AskAnythingComponent,
    data:{name:'Ask Anything'}

  },
  {
    path: 'worldmap',
    component: WorldMapComponent,
    data:{name:'World Map'}

  },
  {
    path: 'neighbors',
    component: YourNeighborsComponent,
    data:{name:'Your Neighbors'}

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
