export class MarketChartRange {
    constructor (
        public prices: Array<any>[],
        public market_caps: Array<any>[],
        public total_volumes: Array<any>[],
    ) {}
}
