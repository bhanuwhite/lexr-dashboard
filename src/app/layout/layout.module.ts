import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { TagModule } from 'primeng/tag';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InnerHeaderComponent } from './inner-header/inner-header.component';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent, InnerHeaderComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    TagModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    SelectButtonModule,
  ],
})
export class LayoutModule {}
