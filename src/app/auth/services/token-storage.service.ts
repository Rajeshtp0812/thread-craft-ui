import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

const ACCESS_TOKEN = 'auth-token';
const REFRESH_TOKEN = 'refresh-token';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    refreshed = false;

    constructor() { }

    signOut(): void {
        window.sessionStorage.clear();
    }

    public saveAccessToken(token: string): void {
        window.sessionStorage.removeItem(ACCESS_TOKEN);
        window.sessionStorage.setItem(ACCESS_TOKEN, token);
    }

    public getAccessToken(): string | null {
        return window.sessionStorage.getItem(ACCESS_TOKEN) || null;
    }

    public saveRefreshToken(user: any): void {
        window.sessionStorage.removeItem(REFRESH_TOKEN);
        window.sessionStorage.setItem(REFRESH_TOKEN, JSON.stringify(user));
    }

    getRefreshToken() {
        const user: any = window.sessionStorage.getItem(REFRESH_TOKEN);
        if (user) {
            return JSON.parse(user).refresh;
        }
        return null;
    }

    getTokenExpirationTime() {
        let token = jwt_decode(JSON.parse(ACCESS_TOKEN));
        if (!token) {
            return;
        }
        return token['exp'];
    }

}