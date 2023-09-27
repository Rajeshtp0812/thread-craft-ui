import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CountryStateCityService } from '../../common/service/country-state-city.service';
import { ClientService } from '../../clients/client.service';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../products/product.service';
import * as converter from 'number-to-words';
import { DateTime } from 'luxon';
import { InvoiceService } from '../services/invoice.service';

interface Invoice {
  clientId?: any,
  invoiceNumber?: string,
  transportMode?: string,
  supplyDate?: string,
  address?: string,
  state?: string,
  city?: string,
  gstNumber?: string,
  contact?: string,
  totalAmount?: number,
  amountInWords?: string,
  invoiceItems: any[]
}

@Component({
  selector: 'app-invoice-config',
  templateUrl: './invoice-config.component.html',
  styleUrls: ['./invoice-config.component.scss']
})
export class InvoiceConfigComponent implements OnChanges {
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
  amountInWords: string = '';

  @Input() editInvoiceData = null;
  @Input() set clearForm(value) {
    if (!value) {
      this.invoices = { invoiceItems: [] };
      this.itemsForm.reset();
    }
  }
  @Output() sendFormData = new EventEmitter();

  constructor(private readonly stateCityService: CountryStateCityService,
    private readonly clientService: ClientService,
    private readonly messageService: MessageService,
    private fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
    private readonly cdRef: ChangeDetectorRef) {
    this.itemsForm = this.fb.group({
      invoiceItems: this.fb.array([this.newItems()]),
    });
    this.statesOptions = this.stateCityService.getStatesByCountry('IN');
    this.statesOptions.unshift(this.select);
    this.fetchClient();
    this.fetchProducts()
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['editInvoiceData'].currentValue?.data) {
      await this.setupForm();
    }
  }

  onFormValueChange(index) {
    this.items.at(index).valueChanges.subscribe(() => this.formData());
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
      this.clients = clients?.data?.map(client => {
        delete client['company'];
        return { label: client.companyName, value: client }
      });
      this.clients.unshift({ label: 'Select', value: '' });
    } catch (err) {
      this.messageService.add({ severity: "error", summary: "Unexpected error occured" });
    }
  }

  onClientSelect() {
    if (this.invoices['clientId']) {
      this.invoices.gstNumber = this.invoices['clientId'].gst;
      this.invoices.contact = this.invoices['clientId'].contact;
      this.invoices.state = this.invoices['clientId'].state;
      this.selectedCity = this.invoices['clientId'].city;
      this.selectState({ label: this.invoices['state'], value: this.invoices['state'] });
      this.invoices.city = this.invoices['clientId'].city;
      this.invoices.address = this.invoices['clientId'].address;
    } else {
      this.invoices.gstNumber = '';
      this.invoices.contact = '';
      this.invoices.state = '';
      this.selectedCity = '';
      this.invoices.city = '';
      this.citiesOptions = [];
      this.invoices.address = '';
    }
  }

  selectState(event: any) {
    this.selectedState = '';
    if (event.value !== this.select) {
      this.selectedState = event.value;
      this.citiesOptions = this.stateCityService.getCitiesByState('IN', this.selectedState);
      if (this.selectedCity && this.editInvoiceData) {
        const index = this.citiesOptions.findIndex((city: any) => city.label === this.selectedCity);
        if (index !== -1) {
          const [movedObject] = this.citiesOptions.splice(index, 1); // Remove the element from its current position
          this.citiesOptions.unshift(movedObject); // Add it to the beginning of the array
        }
      }
    } else {
      this.citiesOptions = [];
    }
  }

  get items(): FormArray {
    return this.itemsForm.get("invoiceItems") as FormArray
  }

  newItems(): FormGroup {
    return this.fb.group({
      code: new FormControl('', [Validators.required]),
      description: new FormControl(),
      hsnCode: new FormControl('', [Validators.required]),
      rate: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      amount: new FormControl(),
    })
  }

  addRow() {
    this.items.push(this.newItems());
    this.formData();
  }

  deleteRow(index: number) {
    this.items.removeAt(index);
    this.calculateTotalAmount();
    this.formData();
  }

  modelChanged(value, key) {
    if (key === 'supplyDate') {
      const date = typeof value === 'string' ? DateTime.fromFormat(value, 'dd/MM/yyyy') : DateTime.fromJSDate(new Date(value));
      this.invoices[key] = date.toFormat("dd/MM/yyyy");
    } else {
      this.invoices[key] = value;
    }
    this.formData();
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
      this.cgstAmount = Number(((totalAmountWoGst * this.cgstPer) / 100).toFixed(2));
    } else {
      this.cgstAmount = 0;
    }

    if (this.sgstPer > 0) {
      this.sgstAmount = Number(((totalAmountWoGst * this.sgstPer) / 100).toFixed(2));
    } else {
      this.sgstAmount = 0;
    }

    this.totalAmount = Number((totalAmountWoGst + this.cgstAmount + this.sgstAmount).toFixed(2));
    let amountInWords = this.toCapitalize(converter.toWords(this.totalAmount));
    let decimalPoint = this.decimalNumberToWord(this.totalAmount);
    this.amountInWords = `${amountInWords} ${decimalPoint}`;
    this.formData();
  }

  formData() {
    this.invoices['amountInWords'] = this.amountInWords;
    this.invoices['cgstPercent'] = Number(this.cgstPer);
    this.invoices['cgstAmount'] = Number(this.cgstAmount);
    this.invoices['sgstPercent'] = Number(this.sgstPer);
    this.invoices['sgstAmount'] = Number(this.sgstAmount);
    this.invoices['totalAmount'] = Number(this.totalAmount);
    let items = this.itemsForm.getRawValue()?.invoiceItems;
    this.invoices['invoiceItems'] = items;
    this.invoices.invoiceItems?.forEach(item => {
      item['code'] = item['code']?.code
    });
    let isValid = this.itemsForm.status === 'VALID' && (this.invoices.clientId && this.invoices.invoiceNumber);
    this.sendFormData.emit({ data: { ...this.invoices, clientId: this.invoices['clientId']?.clientId }, status: isValid });
  }

  decimalNumberToWord(num: any) {
    let fraction = num.toString().split('.')[1];
    let numbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    let word = '';
    if (fraction) {
      for (let i = 0; i < fraction?.length; i++) {
        word += ' ' + numbers[Number(fraction[i])]
      }
    }
    return word ? `Point ${word}` : word;
  }

  toCapitalize(str: any) {
    return str.replace(/(^\w|\s\w)(\S*)/g, (_: any, m1: any, m2: any) => m1.toUpperCase() + m2.toLowerCase())
  }

  async setupForm() {
    try {
      let invoiceDetail = await this.invoiceService.getInvoice(this.editInvoiceData?.data.invoiceId);
      this.invoices['clientId'] = this.clients.find(client => client.label === invoiceDetail?.data['client']['companyName'])?.value;
      this.invoices['state'] = invoiceDetail?.data['state'];
      this.selectedCity = invoiceDetail?.data['city'];
      this.selectState({ label: this.invoices['state'], value: this.invoices['state'] });
      this.invoices['city'] = invoiceDetail?.data['city'];
      this.invoices['invoiceNumber'] = invoiceDetail?.data['invoiceNumber'];
      this.invoices['supplyDate'] = invoiceDetail?.data['supplyDate'];
      this.invoices['gstNumber'] = invoiceDetail?.data['gstNumber'];
      this.invoices['transportMode'] = invoiceDetail?.data['transportMode'];
      this.invoices['contact'] = invoiceDetail?.data['contact'];
      this.invoices['address'] = invoiceDetail?.data['address'];
      this.amountInWords = invoiceDetail?.data['amountInWords'];
      this.cgstPer = invoiceDetail?.data['cgstPercent'];
      this.cgstAmount = invoiceDetail?.data['cgstAmount'];
      this.sgstPer = invoiceDetail?.data['sgstPercent'];
      this.sgstAmount = invoiceDetail?.data['sgstAmount'];
      this.totalAmount = invoiceDetail?.data['totalAmount'];
      invoiceDetail?.data?.invoiceItems?.forEach((item, index) => {
        Object.keys(item).forEach(key => {
          if (key !== 'invoiceItemId' && key !== 'code') {
            this.itemsForm.get("invoiceItems")['controls'][index]['controls'][key].setValue(item[key]);
          } else if (key === 'code') {
            let productValue = this.products.find(product => product.label === item[key]);
            this.itemsForm.get("invoiceItems")['controls'][index]['controls'][key].setValue(productValue.value);
            this.itemsForm.updateValueAndValidity()
          }
        });
        if (index < invoiceDetail?.data?.invoiceItems?.length - 1) {
          this.addRow();
        }
      });
      this.formData();
    } catch (err) {

    }
  }
}
