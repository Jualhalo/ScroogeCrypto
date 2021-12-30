/*
    Type definition for the Results object that contains the results from
    processing the fetched API data. This contains all the data that the user
    will see.
*/
export interface Results {
    cryptoCurrency: string,
    fiatCurrency: string,
    longestBearishTrendLength: number,
    longestBearishTrendStart: string | null,
    longestBearishTrendEnd: string | null,
    highestTradingVolumeDate: string | null,
    highestTradingVolumeValue: number,
    bestBuyDate: string | null,
    bestSellDate: string | null,
    doNotBuyOrSell: boolean,
}