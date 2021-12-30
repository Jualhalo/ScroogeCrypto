/*
    Type definition for the market chart range API fetch parameters
*/
export interface MarketChartRangeParameter {
    startDate: Date,
    endDate: Date,
    crypto: string,
    fiat: string,
}