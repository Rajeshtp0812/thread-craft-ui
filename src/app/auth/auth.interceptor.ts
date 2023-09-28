import { HTTP_INTERCEPTORS, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { COMPANY } from '../common/constants';
import { environment } from '../../environments/environment';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    public jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private tokenStorageService: TokenStorageService,
        private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if ((req.url === environment.companyURL && req.method === 'GET') || req.url.includes('login')
            || req.url.includes('forgot-password')) {
            return next.handle(req);
        }
        let authReq = req;
        let companyId = JSON.parse(localStorage.getItem(COMPANY))?.companyId;
        const updatedParams = new HttpParams().set('companyId', companyId.toString());
        const token = this.tokenStorageService.getAccessToken();
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            authReq = req.clone({
                ...(req.method === 'POST' || req.method === 'GET') && { url: this.addQueryParams(req.url, updatedParams) },
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(authReq).pipe(
            tap(null,
                error => {
                    if (error.error.status_code === 401) {
                        this.tokenStorageService.signOut();
                        this.router.navigate(['/']);
                    }
                })
        );;
    }

    private addQueryParams(url: string, params: HttpParams): string {
        // Append the query parameters to the URL
        return url + (url.includes('?') ? '&' : '?') + params.toString();
    }
}
export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];