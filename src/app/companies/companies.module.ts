import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesTableComponent } from './components/companies-table/companies-table.component';
import { CompaniesMainComponent } from './components/companies-main/companies-main.component';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonsModule } from '../common/commons.module';

@NgModule({
  declarations: [
    CompaniesTableComponent,
    CompaniesMainComponent
  ],
  imports: [
    CommonModule,
    CommonsModule,
    FormsModule,
    CompaniesRoutingModule,
    TableModule,
    ContextMenuModule,
    MenuModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    InputTextareaModule,
    DropdownModule
  ]
})
export class CompaniesModule { }
