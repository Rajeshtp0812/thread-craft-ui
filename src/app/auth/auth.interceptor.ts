import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStorageService } from './services/token-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { COMPANY } from '../common/constants';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    public jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private tokenStorageService: TokenStorageService,
        private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let splittedUrl = req.url.split('/');
        let isCompanyUrl = !(splittedUrl[splittedUrl.length - 2] === 'company');
        let authReq = req;
        let companyId = JSON.parse(localStorage.getItem(COMPANY)).companyId;
        const token = this.tokenStorageService.getToken();
        if (token != null && !this.jwtHelper.isTokenExpired(token)) {
            authReq = req.clone({
                headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token),
                ...(isCompanyUrl && {
                    setParams: {
                        companyId
                    }
                })
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
}
export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];