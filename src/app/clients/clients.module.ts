import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { ClientsConfigComponent } from './components/clients-config/clients-config.component';
import { ClientsMainComponent } from './components/clients-main/clients-main.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';



@NgModule({
  declarations: [
    ClientsTableComponent,
    ClientsConfigComponent,
    ClientsMainComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    MenuModule,
    ContextMenuModule
  ]
})
export class ClientsModule { }
