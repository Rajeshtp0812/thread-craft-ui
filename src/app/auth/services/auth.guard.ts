import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    public jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private auth: TokenStorageService,
        private router: Router) {

    }
    canActivate() {
        // const refreshToken = this.auth.getRefreshToken();
        const refreshToken = true;
        const token = this.auth.getToken();
        if (refreshToken && token && !this.jwtHelper.isTokenExpired(token)) {
            return true
        }
        this.router.navigate(['/']);
        return false;
    }

}
