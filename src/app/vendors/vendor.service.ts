import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


const URL = environment.vendorURL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  refetchData = new Subject();

  constructor(private http: HttpClient) { }

  getVendors(): Promise<any> {
    return lastValueFrom(this.http.get(URL, {}));
  }

  createVendor(data: any): Promise<any> {
    return lastValueFrom(this.http.post(URL, data, httpOptions));
  }

  updateVendor(id: number, data: any): Promise<any> {
    return lastValueFrom(this.http.put(`${URL}${id}`, data, httpOptions));
  }

  deleteVendor(id: number) {
    return lastValueFrom(this.http.delete(`${URL}${id}`));
  }
}
