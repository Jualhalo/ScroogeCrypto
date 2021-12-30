import { Injectable } from '@angular/core';
import { MarketChartRangeParameter } from '../interfaces/marketChartRangeParameter';
import { ConvertUnixDateService } from './convert-unix-date.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateURLService {
  url: string = '';

  constructor(
    private convertUnix: ConvertUnixDateService,
  ) { }

  generateMarketChartRangeURL(formData: MarketChartRangeParameter) {
    /*
      This method generates and returns the url for market chart range API fetch
    */
    let start: number;
    let end: number;

    /*
      Since the api call requires the date in a unix time stamp format, 
      the dates input by the user via the form will be converted using
      the Convert unix date -service.
    */
    start = parseInt(this.convertUnix.convertDateToUnixStamp(formData.startDate));
    end = parseInt(this.convertUnix.convertDateToUnixStamp(formData.endDate));

    //add one hour to end timestamp, to ensure that the last day in the date range will also be included
    end += 3600;

    this.url = "https://api.coingecko.com/api/v3/coins/" + formData.crypto + 
    "/market_chart/range?vs_currency=" + formData.fiat + "&from=" + start +
    "&to=" + end;
    console.log(this.url);
    return this.url;
  }
}
