import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { ContextMenu } from 'primeng/contextmenu';
import { TokenStorageService } from '../auth/services/token-storage.service';
import { Router } from '@angular/router';
import { COMPANY } from '../common/constants';
import { CompaniesService } from '../companies/companies.service';
import { AuthService } from '../auth/services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild('cm') contextMenu: ContextMenu;
    companyName = '';
    companyOptions = [];
    isValid = false;
    selectedCompany = null;
    isPasswordChangeDialog = false;
    password = '';


    isSwitchCompanyFormOpen = false;
    contextMenuItems = [
        { label: 'Switch company', command: () => this.openDialog() },
        { label: 'Change password', command: () => this.openDialog(true) },
        { label: 'Logout', command: () => this.logout() }
    ];

    constructor(public layoutService: LayoutService,
        private readonly tokenStorageService: TokenStorageService,
        private readonly router: Router,
        private readonly companyService: CompaniesService,
        public messageService: MessageService,
        private readonly authService: AuthService) {
        this.companyName = JSON.parse(localStorage.getItem(COMPANY))?.companyName;
        this.companyService.changedCompanyLabel.subscribe(() =>
            this.companyName = JSON.parse(localStorage.getItem(COMPANY))?.companyName);
    }

    async ngOnInit() {
        this.fetchCompanies();
    }

    async fetchCompanies() {
        try {
            this.isValid = false;
            let response = await this.companyService.getCompanies();
            this.companyOptions = response.data.map(item => ({ label: item.companyName, value: item }));
            this.companyOptions.unshift({ label: 'Select Company', value: '' })
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
        }
    }

    selectCompany(company) {
        if (company.value.value) {
            this.isValid = true;
            this.selectedCompany = company.value.value;
        } else {
            this.isValid = false;
            this.selectedCompany = null;
        }
    }

    async submit() {
        if (!this.isPasswordChangeDialog) {
            localStorage.setItem(COMPANY, JSON.stringify(structuredClone(this.selectedCompany)));
            this.layoutService.swicthCompany.next(true);
            this.companyService.changedCompanyLabel.next(true);
            this.selectedCompany = null;
            this.companyOptions = [];
            this.isSwitchCompanyFormOpen = false;
            this.router.navigate(['/main']);
        } else {
            try {
                await this.authService.changePassword({ password: this.password });
                this.messageService.add({ severity: 'success', summary: 'Your password has been changed', detail: '' });
                setTimeout(() => this.logout(), 2000);
            } catch (err) {
                this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
            }
        }
    }

    showContextMenu(event: MouseEvent) {
        event.preventDefault();
        this.contextMenu.show(event);
    }

    async openDialog(isPasswordChange = false) {
        this.isSwitchCompanyFormOpen = true;
        this.isPasswordChangeDialog = isPasswordChange;
        if (!isPasswordChange) {
            await this.fetchCompanies()
        }
    }

    cancel() {
        this.isSwitchCompanyFormOpen = false;
    }

    logout() {
        this.tokenStorageService.signOut();
    }

}
