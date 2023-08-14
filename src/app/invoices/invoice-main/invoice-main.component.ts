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
  activeTabIndex = 0;
  items = [
    { label: "Details" },
    { label: "Preview" }
  ];

  openCompaniesForm(event) {
    this.isInvoiceDialogOpen = !this.isInvoiceDialogOpen;
    this.editProductDetails = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editProductDetails = event.data;
    }
  }

  cancel() {
    this.isInvoiceDialogOpen = false;
    this.activeTabIndex = 0;
  }

  preview() {
    if (this.activeTabIndex === 1) {
      this.activeTabIndex = 0
    } else {
      this.activeTabIndex = 1;
    }
  }

}
