import { Component } from '@angular/core';
import { COMPANY, MODAL_TYPE } from '../../../common/constants';
import { CompaniesService } from '../../companies.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-companies-main',
  templateUrl: './companies-main.component.html',
  styleUrls: ['./companies-main.component.scss']
})
export class CompaniesMainComponent {
  isCompanyFormOpen = false;
  editCompanyDetail: any = null;
  selectedModal: MODAL_TYPE;
  isFormValid = false;
  formData = null;
  selectedCompany;

  constructor(private readonly companyService: CompaniesService,
    private messageService: MessageService) {
    this.selectedCompany = JSON.parse(localStorage.getItem(COMPANY));
  }

  openCompaniesForm(event) {
    this.isCompanyFormOpen = !this.isCompanyFormOpen;
    this.editCompanyDetail = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editCompanyDetail = event.data.item.data;
    }
  }

  closeForm() {
    this.isCompanyFormOpen = false;
  }

  async setFormData(formData: any) {
    this.isFormValid = formData.status;
    this.formData = formData.data;
  }

  async saveCompany() {
    if (!this.isFormValid) {
      return;
    }
    try {
      if (this.selectedModal === MODAL_TYPE.ADD) {
        await this.companyService.createCompany(this.formData);
        this.messageService.add({ severity: 'success', summary: 'Company created successfully', detail: '' });
      } else if (this.selectedModal === MODAL_TYPE.EDIT) {
        await this.companyService.updateCompany(this.editCompanyDetail.companyId, this.formData);
        if (this.selectedCompany.companyId === this.editCompanyDetail.companyId) {
          this.selectedCompany.companyName = this.formData.companyName;
          localStorage.setItem(COMPANY, JSON.stringify(structuredClone(this.selectedCompany)));
          this.companyService.changedCompanyLabel.next(true);
        }
        this.messageService.add({ severity: 'success', summary: 'Company updated succesfully', detail: '' });
      }
      this.closeForm();
      this.companyService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }
}
