export class MarketChartRangeParameter {
    //parameters for the market chart range API request
    constructor (
        public startDate: Date,
        public endDate: Date,
        public crypto: string,
        public fiat: string,
    ) {}
}