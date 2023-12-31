import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CountryStateCityService } from '../../common/service/country-state-city.service';
import { ClientService } from '../../clients/client.service';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../products/product.service';
import { DateTime } from 'luxon';
import { InvoiceService } from '../services/invoice.service';
import { ToWords } from 'to-words';

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
  grossAmount = 0;
  cgstPer = 0;
  sgstPer = 0;
  cgstAmount = 0;
  sgstAmount = 0;
  amountInWords: string = '';
  totalAmount = 0;

  @Input() editInvoiceData = null;
  filteredProducts: any[];
  @Input() set clearForm(value) {
    if (!value) {
      this.invoices = { invoiceItems: [] };
      this.grossAmount = 0;
      this.totalAmount = 0;
      this.amountInWords = '';
      this.cgstPer = 0;
      this.sgstPer = 0;
      this.cgstAmount = 0;
      this.sgstAmount = 0;
      this.itemsForm.reset();
    }
  }
  @Output() sendFormData = new EventEmitter();
  toWords = new ToWords();

  constructor(private readonly stateCityService: CountryStateCityService,
    private readonly clientService: ClientService,
    private readonly messageService: MessageService,
    private fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService) {
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
      this.products = res?.data;
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

  onProductSelect(index) {
    let formCtrl = this.items?.controls[index];
    let product: any = this.products.filter(product => product?.code === formCtrl['controls']?.code?.value);
    if (product) {
      formCtrl['controls'].description.setValue(product[0]?.details);
      formCtrl['controls'].rate.setValue(product[0]?.rate);
      this.calculateAmount(formCtrl['controls']?.rate?.value, index);
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
    this.totalAmount = Number((totalAmountWoGst).toFixed(2));
    this.grossAmount = Math.round(Number((totalAmountWoGst + this.cgstAmount + this.sgstAmount).toFixed(2)));
    this.amountInWords = this.toWords.convert(this.grossAmount, { currency: true });
    this.formData();
  }

  formData() {
    this.invoices['amountInWords'] = this.amountInWords;
    this.invoices['cgstPercent'] = Number(this.cgstPer);
    this.invoices['cgstAmount'] = Number(this.cgstAmount);
    this.invoices['sgstPercent'] = Number(this.sgstPer);
    this.invoices['sgstAmount'] = Number(this.sgstAmount);
    this.invoices['grossAmount'] = Number(this.grossAmount);
    this.invoices['totalAmount'] = Number(this.totalAmount);
    let items = this.itemsForm.getRawValue()?.invoiceItems;
    this.invoices['invoiceItems'] = items;
    let isValid = this.itemsForm.status === 'VALID' && (this.invoices.clientId && this.invoices.invoiceNumber);
    this.sendFormData.emit({ data: { ...this.invoices, clientId: this.invoices['clientId']?.clientId }, status: isValid });
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
      this.grossAmount = invoiceDetail?.data['grossAmount'];
      invoiceDetail?.data?.invoiceItems?.forEach((item, index) => {
        Object.keys(item).forEach(key => {
          if (key !== 'invoiceItemId') {
            this.itemsForm.get("invoiceItems")['controls'][index]['controls'][key].setValue(item[key]);
          }
          this.itemsForm.updateValueAndValidity()
        });
        if (index < invoiceDetail?.data?.invoiceItems?.length - 1) {
          this.addRow();
        }
      });
      this.formData();
    } catch (err) {

    }
  }

  filterProduct(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.products.length; i++) {
      let product = this.products[i];
      if (product.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product.code);
      }
    }
    this.filteredProducts = filtered;
  }
}
