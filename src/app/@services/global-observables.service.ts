import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Target, Watchlist } from '../@models/stocks.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalObservablesService {
  private watchlistsSubject = new BehaviorSubject<Watchlist[]>(JSON.parse(localStorage.getItem('watchlists') || '[]'));
  private targetsSubject = new BehaviorSubject<Target[]>(JSON.parse(localStorage.getItem('targets') || '[]'));

  watchlists$ = this.watchlistsSubject.asObservable();
  targets$ = this.targetsSubject.asObservable();

  get Watchlists(): Watchlist[] {
    return this.watchlistsSubject.getValue();
  }
  get Targets(): Target[] {
    return this.targetsSubject.getValue();
  }

  updateWatchlists(watchlists: Watchlist[]) {
    this.watchlistsSubject.next(watchlists);
    this.saveToLocalStorage();
  }

  updateTargets(targets: Target[]) {
    this.targetsSubject.next(targets);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('watchlists', JSON.stringify(this.watchlistsSubject.getValue()));
    localStorage.setItem('targets', JSON.stringify(this.targetsSubject.getValue()));
  }
  constructor() { }
}
