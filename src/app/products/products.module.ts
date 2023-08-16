import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductMainComponent } from './components/product-main/product-main.component';
import { ProductConfigComponent } from './components/product-config/product-config.component';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductTableComponent,
    ProductMainComponent,
    ProductConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    TableModule,
    ContextMenuModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    FileUploadModule,
    CalendarModule
  ]
})
export class ProductsModule { }
