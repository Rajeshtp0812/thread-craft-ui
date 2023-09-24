import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

const URL = environment.invoiceServiceURL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  refetchData = new Subject();

  constructor(private http: HttpClient) { }

  getInvoice(id: number): Promise<any> {
    return lastValueFrom(this.http.get(`${URL}${id}`, {}));
  }

  getInvoices(): Promise<any> {
    return lastValueFrom(this.http.get(URL, {}));
  }

  createInvoice(data: any): Promise<any> {
    return lastValueFrom(this.http.post(URL, data, httpOptions));
  }

  updateInvoice(id: number, data: any): Promise<any> {
    return lastValueFrom(this.http.put(`${URL}${id}`, data, httpOptions));
  }

  deleteInvoice(id: number) {
    return lastValueFrom(this.http.delete(`${URL}${id}`));
  }
}
