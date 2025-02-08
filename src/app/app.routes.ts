import { Routes } from '@angular/router';
import { StocksListComponent } from './components/watch-list/watch-list.component';
import { NewsComponent } from './components/news/news.component';
import { TargetsComponent } from './components/targets/targets.component';
import { FundCompareComponent } from './components/fund-compare/fund-compare.component';

export const routes: Routes = [
    { path: '', component: StocksListComponent },
    { path: 'news', component: NewsComponent },
    { path: 'targets', component: TargetsComponent },
    { path: 'fundcompare', component:FundCompareComponent },

];