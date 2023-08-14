import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

const URL = environment.clientServiceURL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  refetchData = new Subject();

  constructor(private http: HttpClient) { }

  getClient(id: number): Promise<any> {
    return lastValueFrom(this.http.get(`${URL}${id}`, {}));
  }

  getClients(): Promise<any> {
    return lastValueFrom(this.http.get(URL, {}));
  }

  createClient(data: any): Promise<any> {
    return lastValueFrom(this.http.post(URL, data, httpOptions));
  }

  updateClient(id: number, data: any): Promise<any> {
    return lastValueFrom(this.http.put(`${URL}${id}`, data, httpOptions));
  }

  deleteClient(id: number) {
    return lastValueFrom(this.http.delete(`${URL}${id}`));
  }

}
