import { Injectable } from '@angular/core';
import * as countrycitystatejson from 'countrycitystatejson';

const EXCLUDED_STATES = ['Kenmore', 'Narora', 'Natwar', 'Paschim Medinipur', 'Vaishali'];

@Injectable({
  providedIn: 'root'
})
export class CountryStateCityService {

  constructor() { }

  private countryData = countrycitystatejson;

  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(countryShotName: string) {
    return this.countryData.getStatesByShort(countryShotName).map(((state: string) => {
      return { label: state, value: state };
    })).filter((state: string) => !(EXCLUDED_STATES.includes(state['value'])));
  }

  getCitiesByState(country: string, state: string) {
    return this.countryData.getCities(country, state).map(((city: string) => {
      return { label: city, value: city };
    }));
  }
}
