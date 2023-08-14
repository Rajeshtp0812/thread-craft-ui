import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { ContextMenu } from 'primeng/contextmenu';
import { TokenStorageService } from '../auth/services/token-storage.service';
import { Router } from '@angular/router';
import { COMPANY } from '../common/constants';
import { CompaniesService } from '../companies/companies.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('cm') contextMenu: ContextMenu;

    companyName = '';

    isSwitchCompanyFormOpen = false;
    contextMenuItems = [
        { label: 'Switch company', command: () => this.switchCompany() },
        { label: 'Logout', command: () => this.logout() }
    ];

    constructor(public layoutService: LayoutService,
        private readonly tokenStorageService: TokenStorageService,
        private readonly router: Router,
        private readonly companyService: CompaniesService) {
        this.companyName = JSON.parse(localStorage.getItem(COMPANY))?.label;
        this.companyService.changedCompanyLabel.subscribe(() =>
            this.companyName = JSON.parse(localStorage.getItem(COMPANY))?.label);
    }

    showContextMenu(event: MouseEvent) {
        event.preventDefault();
        this.contextMenu.show(event);
    }

    switchCompany() {
        this.isSwitchCompanyFormOpen = true;
    }

    cancel() {
        this.isSwitchCompanyFormOpen = false;
    }

    logout() {
        this.tokenStorageService.signOut();
        this.router.navigate(['/']);
    }


}
