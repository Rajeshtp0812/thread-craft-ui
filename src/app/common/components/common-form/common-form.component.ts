import { Component, Input } from '@angular/core';
import { CountryStateCityService } from '../../service/country-state-city.service';

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent {
  readonly select = 'Select'
  statesOptions: string[] = [];
  citiesOptions: string[] = [];
  selectedState = '';
  selectedCity = '';

  @Input() set clearForm(value) {
    if (!value) {
      this.statesOptions = [];
      this.citiesOptions = [];
      this.selectedState = '';
      this.selectedCity = ''
    }
  }

  constructor(private readonly stateCityService: CountryStateCityService) { }

  ngOnInit(): void {

  }

  ngOnChanges() {
    let states = this.stateCityService.getStatesByCountry('IN');
    this.statesOptions = states.filter(state => !['Kenmore', 'Narora', 'Natwar', 'Paschim Medinipur', 'Vaishali'].includes(state));
    this.statesOptions.unshift(this.select);
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
}
