import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

const PRODUCT_URL = environment.productServiceURL;
const ALLOTTMENT_URL = environment.productAllottmentServiceURL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  refetchData = new Subject();

  constructor(private http: HttpClient) { }

  getProduct(id: number): Promise<any> {
    return lastValueFrom(this.http.get(`${PRODUCT_URL}${id}`, {}));
  }

  getProducts(): Promise<any> {
    return lastValueFrom(this.http.get(PRODUCT_URL, {}));
  }

  addProduct(data: any): Promise<any> {
    return lastValueFrom(this.http.post(PRODUCT_URL, data));
  }

  updateProduct(id: number, data: any): Promise<any> {
    return lastValueFrom(this.http.put(`${PRODUCT_URL}${id}/`, data));
  }

  deleteProduct(id: number) {
    return lastValueFrom(this.http.delete(`${PRODUCT_URL}${id}`));
  }

  getAllottedProducts(): Promise<any> {
    return lastValueFrom(this.http.get(ALLOTTMENT_URL, {}));
  }

  allotProduct(data: any): Promise<any> {
    return lastValueFrom(this.http.post(ALLOTTMENT_URL, data, httpOptions));
  }

  updateAllotedProduct(id: number, data: any): Promise<any> {
    return lastValueFrom(this.http.put(`${ALLOTTMENT_URL}${id}`, data, httpOptions));
  }

  deleteAllotment(id: number) {
    return lastValueFrom(this.http.delete(`${ALLOTTMENT_URL}${id}`));
  }


}
