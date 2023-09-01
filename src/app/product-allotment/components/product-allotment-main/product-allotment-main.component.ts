import { Component, OnInit } from '@angular/core';
import { MODAL_TYPE } from '../../../common/constants';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../products/product.service';
import { VendorService } from '../../../vendors/vendor.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-product-allotment-main',
  templateUrl: './product-allotment-main.component.html',
  styleUrls: ['./product-allotment-main.component.scss']
})
export class ProductAllotmentMainComponent implements OnInit {
  isAllotmentFormOpen = false;
  editAllotmentDetail: any = null;
  selectedModal: MODAL_TYPE;
  productOptions = [];
  vendorOptions = [];
  totalAmount = 0;
  form: FormGroup;
  isFormValid = false;

  constructor(private messageService: MessageService,
    private readonly productService: ProductService,
    private readonly vendorService: VendorService) {
    this.form = new FormGroup({
      vendor: new FormControl(),
      product: new FormControl(),
      quantity: new FormControl(),
      size: new FormControl(),
      vendorRate: new FormControl(),
      deliveryDate: new FormControl(),
      advancePayment: new FormControl(),
      totalAmount: new FormControl(),
      balanceAmount: new FormControl(),
      description: new FormControl()
    });
  }

  async ngOnInit() {
    await this.fetchVendors();
    await this.fetchProducts();
    this.onValueChanges();
  }

  onValueChanges(): void {
    const quantityControl = this.form.get('quantity');
    const rateControl = this.form.get('vendorRate');
    const advancePaymentControl = this.form.get('advancePayment');

    this.form.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (quantityControl.value && rateControl.value) {
        this.totalAmount = quantityControl.value * rateControl.value;
        this.form.get('totalAmount').setValue(this.totalAmount);
      } else {
        this.form.get('totalAmount').setValue('');
        this.totalAmount = 0;
      }

      if (advancePaymentControl.value !== null) {
        const balanceAmount = this.totalAmount - advancePaymentControl.value;
        this.form.get('balanceAmount').setValue(balanceAmount);
      } else {
        this.form.get('balanceAmount').setValue('');
      }
      this.isFormValid = this.form.status === 'VALID';
    });
  }

  openCompaniesForm(event) {
    this.isAllotmentFormOpen = !this.isAllotmentFormOpen;
    this.editAllotmentDetail = null;
    this.selectedModal = event.modalType;
    if (event?.modalType === MODAL_TYPE.EDIT) {
      this.editAllotmentDetail = event.data.item.data;
      this.setupForm()
    }
  }

  async fetchVendors() {
    try {
      let reponse: any = await this.vendorService.getVendors();
      this.vendorOptions = reponse?.data?.map(vendor => {
        delete vendor['company'];
        return { label: vendor.companyName, value: vendor }
      });
      this.vendorOptions.unshift({ label: 'Select', value: '' });
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }

  async fetchProducts() {
    try {
      let reponse: any = await this.productService.getProducts();
      this.productOptions = reponse?.data?.map(product => {
        delete product['company'];
        return { label: product.code, value: product }
      });
      this.productOptions.unshift({ label: 'Select', value: '' });
    } catch (err) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }

  closeForm() {
    this.isAllotmentFormOpen = false;
  }

  async saveClient() {
    try {
      let payload = this.form.getRawValue();
      payload['vendor'] = payload['vendor']?.vendorId;
      payload['product'] = payload['product']?.productId;
      if (this.selectedModal === MODAL_TYPE.ADD) {
        await this.productService.allotProduct(payload);
        this.messageService.add({ severity: 'success', summary: 'Product allotted successfully', detail: '' });
      } else if (this.selectedModal === MODAL_TYPE.EDIT) {
        await this.productService.updateAllotedProduct(this.editAllotmentDetail.productAllotmentId, payload);
        this.messageService.add({ severity: 'success', summary: 'Allotment updated succesfully', detail: '' });
      }
      this.closeForm();
      this.productService.refetchData.next(true);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Unexpected system error', detail: '' });
    }
  }

  setupForm() {
    let formCtrl = this.form.controls;
    Object.keys(this.form.controls).forEach(key => {
      formCtrl[key].setValue(this.editAllotmentDetail[key]);
    });
  }
}
