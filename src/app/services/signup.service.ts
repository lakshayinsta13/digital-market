import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignupService {

    // ✅ USE RELATIVE URL (PROXY WILL HANDLE IT)
    private API_URL = '/api';

    constructor(private http: HttpClient) { }

    // =========================
    // STATES
    // =========================
    getStates(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/states`);
    }

    // =========================
    // DISTRICTS
    // =========================
    getDistricts(stateId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.API_URL}/districts`,
            { params: { state_id: stateId } }
        );
    }

    // =========================
    // MARKETS
    // =========================
    getMarkets(districtId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.API_URL}/markets`,
            { params: { district_id: districtId } }
        );
    }

    // =========================
    // CREATE MARKET (PROFILE LATER)
    // =========================
    createMarket(data: any): Observable<any> {
        return this.http.post<any>(
            `${this.API_URL}/markets`,
            data
        );
    }
    // 🔹 Check username availability
    checkUsername(username: string) {
        return this.http.get<{ available: boolean }>(
            `${this.API_URL}/check-username?username=${username}`
        );
    }


    // =========================
    // SELLER SIGNUP
    // =========================
    sellerSignup(data: FormData): Observable<any> {
        return this.http.post(
            `${this.API_URL}/seller/signup`,
            data
        );
    }
}
