import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalQuoteResponse, Stock, Watchlist } from '../@models/stocks.model';
import { environment } from '../../environment/environment';
import { GlobalObservablesService } from './global-observables.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiKey = environment.apiKey;
  constructor(
    private http: HttpClient,
    private globalService: GlobalObservablesService

  ) { }

  // Fetch real-time price for a single stock
  getStockPrice(symbol: string): Observable<Stock> {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
    // const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`

    return this.http.get<GlobalQuoteResponse>(url).pipe(
      map(response => {
        console.log(response)
        const data = response['Global Quote'];
        return {
          symbol: data["01. symbol"],
          realTimePrice: parseFloat(data["05. price"]),
          lastPrice: data["08. previous close"],
          change: data["09. change"],
          change_percent: data["10. change percent"],
          marketOpen: true,
        };
      })
    );
  }

  // Fetch real-time prices for all stocks in a watchlist
  getWatchlistPrices(watchlist: Watchlist): Observable<Stock[]> {
    const stockRequests = watchlist.stocks.map(stock => this.getStockPrice(stock.symbol));
    return forkJoin(stockRequests);
  }

  setTargetPrice(stock: Stock, target: number) {
    const currTargets = this.globalService.Targets
    const newTarget = {
      targetPrice: target,
      stock: stock
    }
    this.globalService.updateTargets([...currTargets, newTarget])
  }
}
