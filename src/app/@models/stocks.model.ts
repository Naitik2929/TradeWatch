export interface MetaData {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Interval": string;
    "5. Output Size": string;
    "6. Time Zone": string;
}

export interface TimeSeriesEntry {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
}

export interface TimeSeries {
    [timestamp: string]: TimeSeriesEntry;
}

export interface Response {
    "Meta Data": MetaData;
    "Time Series (5min)": TimeSeries;
}


export interface Stock {
    name?: string,
    symbol: string;
    lastPrice?: string;
    alertPrice?: string;
    realTimePrice: number;
    marketOpen?: boolean;
    change: string;
    change_percent: string
}

export interface Watchlist {
    watchlistId: number;
    watchlistName: string;
    stocks: Stock[];
}

// add stock
export interface GlobalQuote {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
}

export interface GlobalQuoteResponse {
    'Global Quote': GlobalQuote;
}

// slider 
export interface StockMarketData {
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
}

export interface MarketData {
    metadata: string;
    last_updated: string
    top_gainers: StockMarketData[];
    top_losers: StockMarketData[];
    most_actively_traded: StockMarketData[];
}

export interface Target {
    stock: Stock
    targetPrice: number
}