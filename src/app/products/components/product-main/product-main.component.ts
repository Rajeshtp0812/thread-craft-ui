import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../clients/client.service';
import { MODAL_TYPE } from '../../../common/constants';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.component.html',
  styleUrls: ['./product-main.component.scss']
})
export class ProductMainComponent {
  isProductFormOpen = false;
  editProductDetail: any = null;
  selectedModal: MODAL_TYPE;
  isFormValid = false;
  formData = null;
  selectedProduct;

  constructor(private readonly productService: ProductService,
    private messageService: MessageService) {
  }

  openProductForm(event) {
    this.isProductFormOpen = !this.isProductFormOpen;
    this.editProductDetail = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editProductDetail = structuredClone(event.data.item.data);
    }
  }

  closeForm() {
    this.isProductFormOpen = false;
  }

  async setFormData(formData: any) {
    this.isFormValid = formData.status === 'VALID';
    this.formData = formData.data;
  }

  async saveProduct() {
    if (!this.isFormValid) {
      return;
    }
    try {
      if (this.selectedModal === MODAL_TYPE.ADD) {
        await this.productService.addProduct(this.formData);
        this.messageService.add({ severity: 'success', summary: 'Product added successfully', detail: '' });
      } else if (this.selectedModal === MODAL_TYPE.EDIT) {
        for (var pair of this.formData.entries()) {
        }
        await this.productService.updateProduct(this.editProductDetail.productId, this.formData);
        this.messageService.add({ severity: 'success', summary: 'Product updated succesfully', detail: '' });
      }
      this.closeForm();
      this.productService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }
}
