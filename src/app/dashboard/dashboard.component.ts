import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

interface DashboardCard {
    title: string,
    count?: number,
    url?: string,
    icon?: string
}

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


    card: DashboardCard[] = [
        {
            title: 'Company',
            url: '/main/configuration/companies',
            icon: 'pi pi-fw pi-building'
        },
        {
            title: 'Client',
            url: '/main/clients',
            icon: 'pi pi-fw pi-users'
        },
        {
            title: 'Vendor',
            url: '/main/vendors',
            icon: 'pi pi-fw pi-briefcase'
        },
        {
            title: 'Product',
            url: '/main/products',
            icon: 'pi pi-fw pi-shopping-cart'
        },
        {
            title: 'Invoice',
            url: '/main/invoices',
            icon: 'pi pi-fw pi-file'
        }
    ];

    switchCompanySubscription: Subscription;

    constructor(public layoutService: LayoutService,
        private readonly messageService: MessageService) {

    }

    async ngOnInit() {
        this.loadDashboardData();
        this.switchCompanySubscription = this.layoutService.swicthCompany.subscribe(() => this.loadDashboardData());
    }

    async loadDashboardData() {
        try {
            let response = await this.layoutService.getDashboardData();
            let { client, product, invoice, vendor, company } = response.data;
            this.card[0].count = company;
            this.card[1].count = client;
            this.card[2].count = vendor;
            this.card[3].count = product;
            this.card[4].count = invoice;
        } catch (err) {
            this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
        }
    }

    ngOnDestroy(): void {
        if (this.switchCompanySubscription) {
            this.switchCompanySubscription.unsubscribe();
        }
    }
}
