import { Component, CSP_NONCE, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { SortAmountDownIcon } from 'primeng/icons';
import { DrawerModule } from 'primeng/drawer';

import { WatchlistService } from '../../@services/watchlist.service';
import { GlobalQuote, GlobalQuoteResponse, Stock, Watchlist } from '../../@models/stocks.model';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';
import { StockService } from '../../@services/stock.service';
import { GlobalObservablesService } from '../../@services/global-observables.service';

@Component({
  selector: 'app-stocks-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    TableModule,
    InputTextModule,
    TabsModule,
    ButtonModule,
    AutoCompleteModule,
    DrawerModule

  ],
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css'],
})
export class StocksListComponent implements OnInit {
  api_key = environment.apiKey

  selectedStockAdvanced: string = '';
  filteredStocks: Stock[] = [];
  stockList: Stock[] = [];
  watchList: Watchlist[] = [];
  selectedWatchList: number = 0;
  fakeArray = new Array(8);
  visible4: boolean = false;
  selectedStock!: Stock
  targetPrice!: number
  allowRemove: boolean = false

  constructor(
    private watchlistService: WatchlistService,
    private http: HttpClient,
    private router: Router,
    private stockService: StockService,
    private globalService: GlobalObservablesService
  ) { }

  ngOnInit(): void {
    this.fetchWatchlists();
    this.fetchLivePrices();

    // Auto-refresh prices every 30 seconds
    interval(30000).subscribe(() => this.fetchLivePrices());
  }

  fetchLivePrices() {
    this.stockService.getWatchlistPrices(this.watchList[this.selectedWatchList]).subscribe(updatedStocks => {
      console.log(updatedStocks)
      this.watchList[this.selectedWatchList].stocks = updatedStocks;
      this.globalService.updateWatchlists(this.watchList)
    });
  }

  // Fetch watchlists and update the stock list
  fetchWatchlists(): void {
    this.watchlistService.getWatchlists().subscribe((data: Watchlist[]) => {
      this.watchList = data;
      this.updateStockList(0);
    });
  }

  // Filter stocks based on the query
  filterStock(event: AutoCompleteCompleteEvent): void {
    const query = event.query;
    if (query) {
      this.http.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${this.api_key}`)
        .subscribe(
          (response: any) => {
            this.filteredStocks = this.mapApiResponseToStocks(response.bestMatches);
          },
          (error) => {
            console.log(error)
          }
        );
    } else {
      this.filteredStocks = [];
    }
  }

  // Map API response to Stock model
  mapApiResponseToStocks(apiResponse: any[]): Stock[] {
    if (!apiResponse) return JSON.parse(localStorage.getItem('stocks') || '[]')
    return apiResponse.map((item) => ({
      symbol: item['1. symbol'],
      name: item['2. name'],
      type: item['3. type'],
      region: item['4. region'],
      marketOpen: item['5. marketOpen'],
      marketClose: item['6. marketClose'],
      timezone: item['7. timezone'],
      currency: item['8. currency'],
      matchScore: item['9. matchScore'],
      realTimePrice: 0,
      lastPrice: "0",
      change: "0",
      change_percent: "0%",
    }));
  }

  // Check if a stock is already in the current watchlist
  isStockInWatchlist(stock: Stock): boolean {
    return this.watchlistService.isStockInWatchlist(stock, this.watchList[this.selectedWatchList]);
  }

  // Update the stock list based on the selected watchlist
  updateStockList(index: any): void {
    this.selectedWatchList = index;
    this.stockList = this.watchList[index]?.stocks || [];
  }

  // Add stock to watchlist
  addStock(stock: Stock) {
    this.watchlistService.getLastPrice(stock.symbol).subscribe(
      (response: GlobalQuoteResponse) => {
        const globalQuote = response['Global Quote'];
        if (globalQuote) {
          const updatedStock: Stock = {
            ...stock,
            symbol: globalQuote["01. symbol"],
            realTimePrice: parseFloat(globalQuote["05. price"]) || 0,
            lastPrice: globalQuote["08. previous close"] || "0",
            change: globalQuote["09. change"] || "0",
            change_percent: globalQuote["10. change percent"] || "0%",
            marketOpen: true
          };
          console.log('Updated Stock:', updatedStock);

          this.watchlistService.addStockToWatchlist(this.selectedWatchList, updatedStock);
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => console.error('API Error:', error)
    );
  }


  // Redirect to target page
  onShowTargets() {
    this.router.navigate(['/', 'targets'])
  }

  showToolBar(stock: Stock) {
    this.selectedStock = stock
    console.log(this.selectedStock)
    this.visible4 = true
  }

  onSetTarget() {
    this.stockService.setTargetPrice(this.selectedStock, this.targetPrice)
    this.visible4 = false
  }

  getPercent(num1: number | undefined, num2: number) {
    console.log(num1, num2)
    if (num1) {
      return ((num2 - num1) / (num2)) * 100
    }
    return 0
  }

  onRemoveStock(stock: Stock) {
    this.watchlistService.removeStockFromWatchlist(this.selectedWatchList, stock)
  }

  // Redirect to news page
  onShowNews() {
    this.router.navigate(['/', 'news'])
  }

  onCompareFund() {
    this.router.navigate(['/', 'fundcompare'])
  }
}