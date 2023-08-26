import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { ClientsMainComponent } from './components/clients-main/clients-main.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonsModule } from '../common/commons.module';

@NgModule({
  declarations: [
    ClientsTableComponent,
    ClientsMainComponent
  ],
  imports: [
    CommonModule,
    CommonsModule,
    FormsModule,
    ClientsRoutingModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    MenuModule,
    ContextMenuModule,
    DialogModule,
    DropdownModule,
    InputTextareaModule,
  ]
})
export class ClientsModule { }
