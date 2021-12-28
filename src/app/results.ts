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