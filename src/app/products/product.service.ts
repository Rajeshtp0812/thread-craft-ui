import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

const URL = environment.productServiceURL;

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
    return lastValueFrom(this.http.get(`${URL}${id}`, {}));
  }

  getProducts(): Promise<any> {
    return lastValueFrom(this.http.get(URL, {}));
  }

  addProduct(data: any): Promise<any> {
    return lastValueFrom(this.http.post(URL, data, httpOptions));
  }

  updateProduct(id: number, data: any): Promise<any> {
    return lastValueFrom(this.http.put(`${URL}${id}`, data, httpOptions));
  }

  deleteProduct(id: number) {
    return lastValueFrom(this.http.delete(`${URL}${id}`));
  }
}
