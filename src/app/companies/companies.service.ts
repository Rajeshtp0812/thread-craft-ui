import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

const URL = environment.companyURL;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  refetchData = new Subject();
  changedCompanyLabel = new Subject();

  constructor(private http: HttpClient) { }

  getCompanies(): Promise<any> {
    return lastValueFrom(this.http.get(URL, {}));
  }

  createCompany(data: any): Promise<any> {
    return lastValueFrom(this.http.post(URL, data, httpOptions));
  }

  updateCompany(id: number, data: any): Promise<any> {
    return lastValueFrom(this.http.put(`${URL}${id}`, data, httpOptions));
  }
}
