import { Component } from '@angular/core';
import { CountryStateCityService } from '../../common/service/country-state-city.service';

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

  products!: any[];

  statuses!: any[];

  clonedProducts: { [s: string]: any } = {};


  constructor(private readonly stateCityService: CountryStateCityService) { }

  ngOnInit(): void {
    let states = this.stateCityService.getStatesByCountry('IN');
    this.statesOptions = states.filter(state => !['Kenmore', 'Narora', 'Natwar', 'Paschim Medinipur', 'Vaishali'].includes(state));
    this.statesOptions.unshift(this.select);

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' }
    ];

    this.products = [{
      id: '1008',
      code: 'vbb124btr',
      name: 'Game Controller',
      description: 'Product Description',
      image: 'game-controller.jpg',
      price: 99,
      category: 'Electronics',
      quantity: 2,
      inventoryStatus: 'LOWSTOCK',
      rating: 4
    },
    {
      id: '1009',
      code: 'cm230f032',
      name: 'Gaming Set',
      description: 'Product Description',
      image: 'gaming-set.jpg',
      price: 299,
      category: 'Electronics',
      quantity: 63,
      inventoryStatus: 'INSTOCK',
      rating: 3
    },]
  }

  ngOnChanges() {

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

  onRowEditInit(product: any) {
    this.clonedProducts[product.id as string] = { ...product };
  }

  onRowEditSave(product: any) {

  }

  onRowEditCancel(product: any, index: number) {
    this.products[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
  }
}
