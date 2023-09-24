import { Component } from '@angular/core';
import { MODAL_TYPE } from '../../common/constants';
import { InvoiceService } from '../services/invoice.service';
import { MessageService } from 'primeng/api';

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

  constructor(private readonly invoiceService: InvoiceService,
    private messageService: MessageService) { }

  openCompaniesForm(event) {
    this.isInvoiceDialogOpen = !this.isInvoiceDialogOpen;
    this.editProductDetails = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editProductDetails = event.data.item;
    }
  }

  formData(data) {
    this.isValid = data.status;
    this.data = data.data
  }

  async save() {
    if (!this.isValid) {
      return;
    }
    try {
      if (this.selectedModal === MODAL_TYPE.ADD) {
        await this.invoiceService.createInvoice(this.data);
        this.messageService.add({ severity: 'success', summary: 'Invoice created successfully', detail: '' });
      } else if (this.selectedModal === MODAL_TYPE.EDIT) {
        await this.invoiceService.updateInvoice(this.editProductDetails.data.invoiceId, this.data);
        this.messageService.add({ severity: 'success', summary: 'Invoice updated succesfully', detail: '' });
      }
      this.cancel();
      this.invoiceService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }

  cancel() {
    this.isInvoiceDialogOpen = false;
  }

}
