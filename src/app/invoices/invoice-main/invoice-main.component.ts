import { Component } from '@angular/core';
import { MODAL_TYPE } from '../../common/constants';

@Component({
  selector: 'app-invoice-main',
  templateUrl: './invoice-main.component.html',
  styleUrls: ['./invoice-main.component.scss']
})
export class InvoiceMainComponent {
  isInvoiceDialogOpen = false;
  editProductDetails: any = null;
  selectedModal: MODAL_TYPE;
  isValid = false;
  data = null;


  openCompaniesForm(event) {
    this.isInvoiceDialogOpen = !this.isInvoiceDialogOpen;
    this.editProductDetails = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editProductDetails = event.data;
    }
  }

  formData(data) {
    this.isValid = data.status;
    data = data.data
  }

  cancel() {
    this.isInvoiceDialogOpen = false;
  }

}
