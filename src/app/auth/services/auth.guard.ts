import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
class AuthGuard {

    public jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private auth: TokenStorageService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //your logic goes here
        // const refreshToken = this.auth.getRefreshToken();
        const refreshToken = true;
        const token = this.auth.getAccessToken();
        if (refreshToken && token && !this.jwtHelper.isTokenExpired(token)) {
            return true
        }
        this.router.navigate(['/']);
        return false;
    }

}

export const isAuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(AuthGuard).canActivate(next, state);
}
