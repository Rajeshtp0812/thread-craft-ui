import { Component, Input } from '@angular/core';
import { CountryStateCityService } from '../../common/service/country-state-city.service';
import { ClientService } from '../../clients/client.service';
import { MessageService } from 'primeng/api';

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
  invoiceItems: InvoiceItems[]
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
  selectedState = '';
  selectedCity = '';
  activeIndex = -1;
  clients = [];
  isFormValid = false;

  invoices: Invoice = { invoiceItems: [] };

  clonedProducts: { [s: string]: any } = {};

  @Input() set resetActiveIndex(value) {
    if (value) {
      this.activeIndex = 0;
    } else {
      this.activeIndex = -1;
    }
  }


  constructor(private readonly stateCityService: CountryStateCityService,
    private readonly clientService: ClientService,
    private readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.statesOptions = this.stateCityService.getStatesByCountry('IN');
    this.statesOptions.unshift(this.select);
    this.fetchClient();
    this.invoices['invoiceItems'] = [{
      id: 1,
      code: '1254',
      description: 'test1',
      hsnCode: '548',
      rate: 125,
      quantity: 12,
      amount: 120
    },
    {
      id: 2,
      code: '1254',
      description: 'test2',
      hsnCode: '548',
      rate: 125,
      quantity: 12,
      amount: 120
    },
    {
      id: 3,
      code: '1254',
      description: 'test3',
      hsnCode: '548',
      rate: 125,
      quantity: 12,
      amount: 120
    },
    {
      id: 4,
      code: '1254',
      description: 'test4',
      hsnCode: '548',
      rate: 125,
      quantity: 12,
      amount: 120
    }]
  }

  ngOnChanges() {

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

  addRow() {
    let row: InvoiceItems = { code: null, description: null, hsnCode: null, rate: null, quantity: null, amount: null }
    this.invoices.invoiceItems.push(row);
  }

  deleteRow(index: number) {
    this.invoices.invoiceItems.splice(index, 1);
  }

  modelChanged(event) {
    console.log(event)
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(product: any) {

  }

  onRowEditCancel(product: any, index: number) {
    this.invoices[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
  }
}
