import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductAllotmentRoutingModule } from './product-allotment-routing.module';
import { ProductAllotmentTableComponent } from './components/product-allotment-table/product-allotment-table.component';
import { ProductAllotmentMainComponent } from './components/product-allotment-main/product-allotment-main.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    ProductAllotmentTableComponent,
    ProductAllotmentMainComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductAllotmentRoutingModule,
    DialogModule,
    TableModule,
    ContextMenuModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule
  ]
})
export class ProductAllotmentModule { }
