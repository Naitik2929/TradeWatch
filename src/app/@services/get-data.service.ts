import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { MarketData, StockMarketData } from '../@models/stocks.model';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  api_key = environment.apiKey
  constructor(private http: HttpClient) { }

  getStockBySymbol(symbol: string): Observable<Response> {
    // return this.http.get<Response>(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=demo`)
    return this.http.get<Response>(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.api_key}`)
  }
  getMarketData() {
    return this.http.get<MarketData>(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo`)
  }
}
