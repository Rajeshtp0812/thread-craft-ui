import { Injectable } from '@angular/core';
import * as countrycitystatejson from 'countrycitystatejson';

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
    return this.countryData.getStatesByShort(countryShotName).map(((city: string) => {
      return { label: city, value: city };
    }));
  }

  getCitiesByState(country: string, state: string) {
    return this.countryData.getCities(country, state).map(((city: string) => {
      return { label: city, value: city };
    }));
  }
}
