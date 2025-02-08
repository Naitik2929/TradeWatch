import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as mfs from '../assets/mfs.json'
import { Mutualfund, MutualfundData } from '../@models/mfs.model';

@Injectable({
    providedIn: 'root'
})
export class MfsService {
    data: Mutualfund[] = (mfs as any).default;

    constructor(private http: HttpClient) { }

    getData(): Observable<any> {
        return of(this.data)
    }
    // https://api.mfapi.in/mf/122640
    getMutualFund(scheme_code: number): Observable<MutualfundData> {
        return this.http.get<MutualfundData>(`https://api.mfapi.in/mf/${scheme_code}`)
    }
}