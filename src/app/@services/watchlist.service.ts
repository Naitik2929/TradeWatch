import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { GlobalQuoteResponse, Stock, Watchlist } from '../@models/stocks.model';
import { GlobalObservablesService } from './global-observables.service';
@Injectable({
    providedIn: 'root',
})
export class WatchlistService {
    private apiKey = environment.apiKey;

    constructor(private http: HttpClient, private globalService: GlobalObservablesService) { }

    // Fetch watchlists from the API
    getWatchlists(): Observable<Watchlist[]> {
        return this.globalService.watchlists$
    }

    // Filter stocks based on the query
    filterStocks(query: string, stocks: Stock[]) {
        return stocks.filter((stock) => stock.name?.toLowerCase().includes(query.toLowerCase()));
    }

    // Check if a stock is already in the watchlist
    isStockInWatchlist(stock: Stock, watchlist: Watchlist): boolean {
        return watchlist.stocks.some((s) => s.symbol === stock.symbol);
    }

    // Add stock to watchlist
    addStockToWatchlist(watchlistId: number, stock: Stock) {
        const watchlists = this.globalService.Watchlists
        const watchlist = watchlists.find(el => el.watchlistId == watchlistId)
        if (watchlist) {
            if (!this.isStockInWatchlist(stock, watchlist)) {
                watchlist.stocks.push(stock)
                this.globalService.updateWatchlists(watchlists)
            }
        }
    }

    // Get Latest Price
    getLastPrice(symbol: string): Observable<GlobalQuoteResponse> {
        return this.http.get<GlobalQuoteResponse>(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`)
    }

    removeStockFromWatchlist(watchlistId: number, stock: Stock) {
        console.log(watchlistId)
        let watchlists = this.globalService.Watchlists
        const watchlist = watchlists.find(el => el.watchlistId == watchlistId)
        if (watchlist) {
            const updatedStocks = watchlist.stocks.filter(el => el.symbol !== stock.symbol)
            watchlists[watchlist.watchlistId].stocks = updatedStocks
            this.globalService.updateWatchlists(watchlists)
        }
    }
}

// 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo'