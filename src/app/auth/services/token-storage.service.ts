import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';


const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    refreshed = false;
    constructor() { }
    signOut(): void {
        window.sessionStorage.clear();
    }
    public saveToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }
    public getToken(): string | null {
        return window.sessionStorage.getItem(TOKEN_KEY) || null;
    }
    public saveUser(user: any): void {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    public getUser(): any {
        const user: any = window.sessionStorage.getItem(USER_KEY);
        if (user) {
            return jwt_decode(JSON.parse(user).access);
        }
        return {};
    }

    getRefreshToken() {
        const user: any = window.sessionStorage.getItem(USER_KEY);
        if (user) {
            return JSON.parse(user).refresh;
        }
        return null;
    }
}