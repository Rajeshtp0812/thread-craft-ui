import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const AUTH_API = environment.authServiceURL;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        return this.http.post(AUTH_API + 'token/', {
            email,
            password
        }, httpOptions);
    }

    refreshToken(refreshToken: any) {
        return this.http.post(AUTH_API + 'refresh/', refreshToken, httpOptions);
    }
}