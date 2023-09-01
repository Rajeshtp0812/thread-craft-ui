import { Component } from '@angular/core';
import { MODAL_TYPE } from '../../../common/constants';
import { ClientService } from '../../client.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-clients-main',
  templateUrl: './clients-main.component.html',
  styleUrls: ['./clients-main.component.scss']
})
export class ClientsMainComponent {
  isClientFormOpen = false;
  editClientDetail: any = null;
  selectedModal: MODAL_TYPE;
  isFormValid = false;
  formData = null;
  selectedCompany;

  constructor(private readonly clientService: ClientService,
    private messageService: MessageService) {
  }

  openCompaniesForm(event) {
    this.isClientFormOpen = !this.isClientFormOpen;
    this.editClientDetail = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editClientDetail = event.data.item.data;
    }
  }

  closeForm() {
    this.isClientFormOpen = false;
  }

  async setFormData(formData: any) {
    this.isFormValid = formData.status;
    this.formData = formData.data;
  }

  async saveClient() {
    if (!this.isFormValid) {
      return;
    }
    try {
      if (this.selectedModal === MODAL_TYPE.ADD) {
        await this.clientService.createClient(this.formData);
        this.messageService.add({ severity: 'success', summary: 'Company created successfully', detail: '' });
      } else if (this.selectedModal === MODAL_TYPE.EDIT) {
        await this.clientService.updateClient(this.editClientDetail.clientId, this.formData);
        this.messageService.add({ severity: 'success', summary: 'Company updated succesfully', detail: '' });
      }
      this.closeForm();
      this.clientService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }
}
