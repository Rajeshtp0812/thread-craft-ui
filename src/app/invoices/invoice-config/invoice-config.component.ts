import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CountryStateCityService } from '../../common/service/country-state-city.service';
import { ClientService } from '../../clients/client.service';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../products/product.service';

const requiredFields = []

interface InvoiceItems {
  id?: number | string,
  code: string,
  description: string,
  hsnCode: string,
  rate: number,
  quantity: number,
  amount: number
}

interface Invoice {
  client?: any,
  invoiceNumber?: string,
  transportationType?: string,
  supplyDate?: string,
  address?: string,
  state?: string,
  city?: string,
  invoiceItems: any[]
}

@Component({
  selector: 'app-invoice-config',
  templateUrl: './invoice-config.component.html',
  styleUrls: ['./invoice-config.component.scss']
})
export class InvoiceConfigComponent {
  readonly select = 'Select'
  statesOptions: string[] = [];
  citiesOptions: string[] = [];
  products = [];
  selectedState = '';
  selectedCity = '';
  activeIndex = -1;
  clients = [];
  isFormValid = false;
  itemsForm: FormGroup;
  invoices: Invoice = { invoiceItems: [] };
  totalAmount = 0;
  cgstPer = 0;
  sgstPer = 0;
  cgstAmount = 0;
  sgstAmount = 0;

  @Output() sendFormData = new EventEmitter();

  constructor(private readonly stateCityService: CountryStateCityService,
    private readonly clientService: ClientService,
    private readonly messageService: MessageService,
    private fb: FormBuilder,
    private readonly productService: ProductService) {
    this.itemsForm = this.fb.group({
      invoiceItems: this.fb.array([this.newItems()]),
    });
  }

  ngOnInit(): void {
    this.statesOptions = this.stateCityService.getStatesByCountry('IN');
    this.statesOptions.unshift(this.select);
    this.fetchClient();
    this.fetchProducts()
  }

  ngOnChanges() {

  }

  onValueChanges() {
    this.itemsForm.valueChanges.subscribe()
  }

  async fetchProducts() {
    try {
      let res = await this.productService.getProducts();
      this.products = res?.data?.map(product => ({ label: product.code, value: product }));
      this.products.unshift({ label: 'Select', value: '' });
    } catch (err) {
      this.messageService.add({ severity: "error", summary: "Unexpected error occured" });
    }
  }

  async fetchClient() {
    try {
      let clients = await this.clientService.getClients();
      this.clients = clients?.data?.map(client => ({ label: client.companyName, value: client }));
    } catch (err) {
      this.messageService.add({ severity: "error", summary: "Unexpected error occured" });
    }
  }

  selectState(event: any) {
    this.selectedState = '';
    if (event.value !== this.select) {
      this.selectedState = event.value;
      this.citiesOptions = this.stateCityService.getCitiesByState('IN', this.selectedState);
    } else {
      this.citiesOptions = [];
    }
  }

  get items(): FormArray {
    return this.itemsForm.get("invoiceItems") as FormArray
  }

  newItems(): FormGroup {
    return this.fb.group({
      code: new FormControl(''),
      description: new FormControl(),
      hsnCode: new FormControl(),
      rate: new FormControl(),
      quantity: new FormControl(),
      amount: new FormControl(),
    })
  }

  addRow() {
    this.items.push(this.newItems());
  }

  deleteRow(index: number) {
    this.items.removeAt(index);
    this.calculateTotalAmount();
  }

  modelChanged(value, key) {
    this.invoices[key] = value;
  }

  onProductSelect(evt, index) {
    let formCtrl = this.items?.controls[index];
    if (evt.value) {
      formCtrl['controls'].description.setValue(evt.value.details);
      formCtrl['controls'].rate.setValue(evt.value.rate);
    }
  }

  calculateAmount(quantity, index) {
    let formCtrl = this.items?.controls[index];
    if (formCtrl['controls']?.rate?.value) {
      try {
        formCtrl['controls'].amount.setValue(Number(quantity) * Number(formCtrl['controls']?.rate?.value));
        this.calculateTotalAmount();
      } catch (err) {

      }
    }
  }

  calculateTotalAmount() {
    let formCtrls = this.items.controls;
    let totalAmountWoGst = 0;
    formCtrls?.forEach((formCtrl) => {
      totalAmountWoGst += Number(formCtrl['controls']?.amount?.value);
    });
    if (this.cgstPer > 0) {
      this.cgstAmount = (totalAmountWoGst * this.cgstPer) / 100;
    }

    if (this.sgstPer > 0) {
      this.sgstAmount = (totalAmountWoGst * this.sgstPer) / 100;
    }

    this.totalAmount = totalAmountWoGst + this.cgstAmount + this.sgstAmount;
  }

  formData() {
    this.invoices['invoiceItems'] = this.itemsForm.getRawValue();
    this.sendFormData.emit({ data: this.invoices, status: this.itemsForm.status === 'VALID' });
  }
}
