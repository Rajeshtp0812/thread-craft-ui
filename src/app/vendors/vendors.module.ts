import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorMainComponent } from './vendor-main/vendor-main.component';
import { VendorTableComponent } from './vendor-table/vendor-table.component';
import { VendorConfigComponent } from './vendor-config/vendor-config.component';
import { DialogModule } from 'primeng/dialog';
import { CommonsModule } from '../common/commons.module';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VendorMainComponent,
    VendorTableComponent,
    VendorConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    VendorsRoutingModule,
    DialogModule,
    TableModule,
    ContextMenuModule,
    InputTextModule,
    TooltipModule,
    ButtonModule
  ]
})
export class VendorsModule { }
