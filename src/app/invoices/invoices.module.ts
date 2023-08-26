import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';
import { InvoiceMainComponent } from './invoice-main/invoice-main.component';
import { InvoiceConfigComponent } from './invoice-config/invoice-config.component';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    InvoiceTableComponent,
    InvoiceMainComponent,
    InvoiceConfigComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InvoicesRoutingModule,
    DialogModule,
    StepsModule,
    ButtonModule,
    AccordionModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextareaModule,
    TableModule,
    ContextMenuModule,
    InputNumberModule
  ]
})
export class InvoicesModule { }
