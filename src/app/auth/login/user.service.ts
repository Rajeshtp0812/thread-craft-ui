import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

const AUTH_API = environment.authServiceURL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  async login(username: string, password: string): Promise<any> {
    return await lastValueFrom(this.http.post(AUTH_API + 'login', {
      username,
      password
    }, httpOptions));
  }
}
