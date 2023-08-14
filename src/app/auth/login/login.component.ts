import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompaniesService } from '../../companies/companies.service';
import { COMPANY } from '../../common/constants';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
    username!: string;
    password!: string;
    selectedCompany!: any;
    companyOptions = [];

    constructor(private readonly userService: UserService,
        private readonly tokenStorage: TokenStorageService,
        private readonly router: Router,
        private messageService: MessageService,
        private readonly companyService: CompaniesService) { }

    async ngOnInit() {
        try {
            let response = await this.companyService.getCompanies();
            this.companyOptions = response.data.map(item => ({ label: item.companyName, value: item }));
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
        }
    }

    async login() {
        try {
            let response = await this.userService.login(this.username, this.password);
            this.tokenStorage.saveToken(response.data.token);
            localStorage.setItem(COMPANY, JSON.stringify(this.selectedCompany.value));
            this.router.navigate(['/main']);
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
        }

    }
}
