export interface Mutualfund {
    schemeCode: number,
    schemeName: string,
    isinGrowth: string | null,
    isinDivReinvestment: string | null
}

export interface MutualfundMetaData {
    fund_house: string,
    scheme_type: string,
    scheme_category: string,
    scheme_code: number,
    scheme_name: string,
    isin_growth: string | null,
    isin_div_reinvestment: string | null
}

export interface MutualfundData {
    meta: MutualfundMetaData
    data: [
        {
            date: string
            nav: number
        }
    ]
}