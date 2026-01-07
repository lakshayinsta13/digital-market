import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// =========================
// LOGIN RESPONSE
// =========================
export interface LoginResponse {
    success: boolean;
    seller_id: number;
    username: string;
}

// =========================
// SELLER PROFILE MODEL
// =========================
export interface SellerProfile {
    seller_id: number;
    username: string;
    shopkeeper_name: string;
    shop_name: string;
    shop_location: string;
    state: string;
    district: string;
    market: string | null;
    shop_image: string | null;
}

// =========================
// API RESPONSE WRAPPER
// =========================
export interface SellerProfileResponse {
    success: boolean;
    seller: SellerProfile;
}

@Injectable({
    providedIn: 'root'
})
export class LoginServices {

    private readonly API_URL = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    // =========================
    // SELLER LOGIN
    // =========================
    sellerLogin(
        data: { username: string; password: string }
    ): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.API_URL}/seller/login`,
            data
        );
    }

    // =========================
    // GET SELLER PROFILE (MY SHOP)
    // =========================
    getSellerProfile(
        sellerId: number
    ): Observable<SellerProfileResponse> {
        return this.http.get<SellerProfileResponse>(
            `${this.API_URL}/seller/profile/${sellerId}`
        );
    }
}
