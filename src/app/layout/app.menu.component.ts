import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/main'] }
                ]
            },
            {
                label: 'Embroidery Management System',
                items: [
                    { label: 'Clients', icon: 'pi pi-fw pi-users', routerLink: ['/main/clients'] },
                    { label: 'Products', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/main/products'] },
                    { label: 'Invoices', icon: 'pi pi-fw pi-file', routerLink: ['/main/invoices'] },
                    {
                        label: 'Vendors',
                        icon: 'pi pi-fw pi-briefcase',
                        items: [
                            {
                                label: 'Manage Vendors',
                                icon: 'pi pi-fw pi-cog',
                                routerLink: ['/main/vendors']
                            },
                            {
                                label: 'Allocate Products',
                                icon: 'pi pi-fw pi-fw pi-sign-in',
                                routerLink: ['/main/allocate-products']
                            }
                        ]
                    },

                ]
            },
            {
                label: 'Configuration',
                items: [
                    { label: 'Companies', icon: 'pi pi-fw pi-building', routerLink: ['/main/configuration/companies'] },
                ]
            },
        ];
    }
}
