import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import * as productService from './common/service/product.service';
import { CountryService } from './common/service/country.service';
import { CustomerService } from './common/service/customer.service';
import { EventService } from './common/service/event.service';
import { IconService } from './common/service/icon.service';
import { NodeService } from './common/service/node.service';
import { PhotoService } from './common/service/photo.service';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, productService.ProductService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
