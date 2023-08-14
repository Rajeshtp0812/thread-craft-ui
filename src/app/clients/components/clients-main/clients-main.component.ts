import { Component } from '@angular/core';
import { MODAL_TYPE } from '../../../common/constants';

@Component({
  selector: 'app-clients-main',
  templateUrl: './clients-main.component.html',
  styleUrls: ['./clients-main.component.scss']
})
export class ClientsMainComponent {
  isClientFormOpen = false;
  editProductDetails: any = null;
  selectedModal: MODAL_TYPE;
  isFormValid = false;

  openCompaniesForm(event) {
    this.isClientFormOpen = !this.isClientFormOpen;
    this.editProductDetails = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editProductDetails = event.data;
    }
  }

  cancel() {
    this.isClientFormOpen = false;
  }

  formData(data: any) {
    this.isFormValid = data.status;
  }
}
