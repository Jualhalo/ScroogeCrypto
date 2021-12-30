import { Component, OnInit } from '@angular/core';
import { ConvertUnixDateService } from '../services/convert-unix-date.service';
import { FetchAPIDataService } from '../services/fetch-apidata.service';
import { FormDataService } from '../services/formData.service';
import { GenerateURLService } from '../services/generate-url.service';
import { MarketChartRange } from '../interfaces/marketChartRange';
import { MarketChartRangeParameter } from '../interfaces/marketChartRangeParameter';
import { BuyAndSellDates } from '../interfaces/buyAndSellDates';
import { Profits } from '../interfaces/profits';
import { Results } from '../interfaces/results';

@Component({
  selector: 'app-handle-api-data',
  templateUrl: './handle-api-data.component.html',
  styleUrls: ['./handle-api-data.component.css']
})
export class HandleApiDataComponent implements OnInit { 
  url: string = '';
  data!: MarketChartRange;
  results: Partial<Results> = {}; 

  /*
    These variables control the visibility of the processed data
    to the user. If there are any errors then the error will be shown instead.
    If no data was received via the api fetch, while no error was received either,
    this means that the input data was invalid and the user will be notified to
    re-check their input.
  */
  error: string | undefined = undefined;
  haveResults: boolean = false;
  dataIsEmpty: boolean = false;

  constructor(
    private formdataservice: FormDataService,
    private apiservice: FetchAPIDataService,
    private urlservice: GenerateURLService,
    private convertUnix: ConvertUnixDateService,
  ) { }

  ngOnInit(): void {
    /*
      Subscribes to the formData observable in the
      form data service. Whenever new data is assigned to the variable,
      getAPIData method will be called and a new API fetch will be made.

      The crypto and fiatcurrency properties of results will be
      re-assigned here as well, so that they can later be shown to the user as
      part of the result text.
    */
    this.formdataservice.formData$.subscribe(
      data => {
        this.results.cryptoCurrency = data.crypto;
        this.results.fiatCurrency = data.fiat;
        this.getAPIData(data);
      }
    )
  }

  getAPIData(formData: MarketChartRangeParameter) {
    //generate the url for the api fetch using the generate url service.
    this.url = this.urlservice.generateMarketChartRangeURL(formData);

    /*
      Make the api fetch using fetch api data service and subscribe 
      to the observable that is returned by the service. 
      If an error is received, assign it to the error variable so that it
      can be shown to the user.
      Otherwise calls the handleAPIData method to process the data received.
    */
    this.apiservice.fetchAPIData(this.url).subscribe({
      next: (res: MarketChartRange) => this.data = res,
      error: (err: string | undefined) => this.error = err,
      complete: () => {
        this.error = undefined;
        this.handleAPIData(this.data);
      },
    });
  }

  handleAPIData(data: MarketChartRange) {
    /*
      Check the response data. If any of the object keys are empty,
      this most is likely due to invalid user input.
      In this case dataIsEmpty is set to true so that the user will be
      notified.
    */
    if (Object.values(data).some(a => a.length === 0)) {
      this.haveResults = false;
      this.dataIsEmpty = true;
    } else {
      /*
        If the response was not empty, the received data will be
        processed by the methods below and finally made visible to
        the user by setting haveResults to true.
      */
      this.dataIsEmpty = false;
      this.findLongestBearishTrend(data);
      this.findHighestTradingVolume(data);
      this.findBestDaysToBuyAndSell(data);
      this.haveResults = true;
    }
  }

  findLongestBearishTrend(data: MarketChartRange) {
    /*
      This method finds all the sequences of days where the cryptocurrency price decreased
      and assigns the length as well as the start and end dates of the longest sequence to
      variables that will be shown to the user.
    */
    /*
      handleDataGranularity method is called to ensure that the data to be processed 
      is in daily format, rather than hourly or every 5 minutes.
    */
    let prices = this.handleDataGranularity(data.prices);

    let startIndex = 0;
    let endIndex = 0;
    let length = 1;

    let longestSequence = {
      startIndex: 0,
      endIndex: 0,
      length: 1,
    }

    //This Array will contain all the price data from the longest sequence found
    let longestBearishTrend: Array<any> = [];

    /*
      This loop finds all the sequences where the price is lower than the previous day.
      The longestSequence variable gets updated whenever a longer sequence is found.
    */
    for (let i=0; i < prices.length; i++) {
      if (i > 0) {
        if (prices[i][1] < prices[i-1][1]) {
          length += 1;
          endIndex = i;
        } else {
          length = 1;
          startIndex = i;
        }
      }

      if (length > longestSequence.length) {
        longestSequence.length = length;
        longestSequence.startIndex = startIndex;
        longestSequence.endIndex = endIndex;
      }
    }

    /*
      Push the data from the prices array into the longestBearishTrend array.
      The startindex property indicates the day the sequence starts on the prices array.
    */
    for (let i = longestSequence.startIndex; i < (longestSequence.startIndex + longestSequence.length); i++) {
      longestBearishTrend.push(prices[i]);
    }

    /*
      Assign the longest bearish trend to the variables that will be shown to the user.
      Also convert the unix time stamps to date format using convert unix date service.
    */
    this.results.longestBearishTrendLength = longestBearishTrend.length - 1;
    this.results.longestBearishTrendStart = this.convertUnix.convertUnixStampToDate(longestBearishTrend[0][0]);
    this.results.longestBearishTrendEnd = this.convertUnix.convertUnixStampToDate(
        longestBearishTrend[longestBearishTrend.length - 1][0]);
  }

  findHighestTradingVolume(data: MarketChartRange) {
    /*
      This method finds the date and the value of the highest total trading volume.
    */
    /*
      handleDataGranularity method is called to ensure that the data to be processed 
      is in daily format, rather than hourly or every 5 minutes.
    */
    let totalvolumes = this.handleDataGranularity(data.total_volumes);

    let timestamp: number = totalvolumes[0][0]; 
    let highestVolume: number = 0;

    /*
      This loop finds the largest value in total volumes. Whenever a higher value is found
      the variables: timestamp and highestVolume will be updated.
    */
    for(let i=0; i < totalvolumes.length; i++) {
      if (totalvolumes[i][1] > highestVolume) {
        highestVolume = totalvolumes[i][1];
        timestamp = totalvolumes[i][0]
      }
    }
    /*
      Lastly assign the values to the variables that will be shown to the user.
      Also convert the time stamp to date format using convert unix date service.
      The volume value is converted to two decimals
    */
    this.results.highestTradingVolumeDate = this.convertUnix.convertUnixStampToDate(timestamp);
    this.results.highestTradingVolumeValue = +(highestVolume.toFixed(2));
  }

  findBestDaysToBuyAndSell(data: MarketChartRange) {
    /*
      This method finds the best buy and sell dates from the input date range.
    */
    /*
      Again call the handleDataGranularity method to ensure that the data to be processed 
      is in daily format.
    */
    let prices = this.handleDataGranularity(data.prices);
    
    /*
      calculateProfits method is called to build the array where all possible profits
      from the date range will be collected to.
    */
    let profits: Array<Profits> = this.calculateProfits(prices);

    let bestProfit = 0;

    /*
      Finds the index of the largest profit value in the profits array
    */
    for (let i=0; i < profits.length; i++) {
      if(profits[i].profit > bestProfit) {
        bestProfit = i;
      }
    }
    /*
      In cases where there are no profits between any of the dates in the 
      input date range the bestProfit will be undefined and the user
      will be notified that they should not buy nor sell on any of the dates.

      In other cases the dates from the prices array that the bestProfit buy and sell date 
      indexes point to will be converted to date format and 
      assigned to the variables that will be shown to the user.
    */
    if (profits[bestProfit] === undefined) {
      this.results.doNotBuyOrSell = true;
    } else {
      this.results.doNotBuyOrSell = false;
      this.results.bestBuyDate = this.convertUnix.convertUnixStampToDate(prices[profits[bestProfit].buyDateIndex][0]);
      this.results.bestSellDate = this.convertUnix.convertUnixStampToDate(prices[profits[bestProfit].sellDateIndex][0]);
    }
    
  }

  handleDataGranularity (data:Array<any>) {
    /*
      The market chart range API fetch response differs based on the 
      length of the input date range. 
      
      If the date range is below 90 days in length, the data will be hourly and
      if one day or below, the data will be every five minutes.
      
      This method will ensure that the data to be processed will always be in
      daily format by checking the length of the date range and 
      omitting the unnecessary data points in between.      
    */
    const startDate: number = data[0][0];
    const endDate: number = (data[data.length-1][0]);
    const dateRange: number = endDate - startDate;
    const day: number = 86400000;
    const threeMonths: number = day * 90;

    let newdata = [];

    /*
      If the start and end dates in the date range are the same, 
      (which means the difference between start and end dates is 0)
      simply return the first element in the array.
    */
    if (dateRange === 0) {
      newdata.push(data[0]);
      return newdata;
    /*
      If the date range is below three months, find all data point
      indexes that are divisible by 24 and push the values from them into
      the array that is returned.
    */
    } else if (dateRange < threeMonths) {
      for (let i = 0; i < data.length; i++) {
        if (i % 24 === 0) {
          newdata.push(data[i]);
        }
      }
      return newdata;
    /*
      If the data is already in daily format, then nothing needs to 
      be done and the array can be returned as it is.
    */
    } else {
      return data;
    }
  }

  calculateProfits (prices:Array<any>) {
    /*
      This method finds all the profits between all the possible
      buy and sell dates in the date range and pushes them into the profits 
      that will be returned.

      It's assumed that Scrooge can't take the crypto currency he's bought 
      with him in the time machine (after all, crypto coins are not physical),
      therefore it needs to be ensured that the buy dates are always before the 
      sell dates.

      For example, if the day with the lowest price (the best day to buy) was the 
      very last date in the input date range, it can't be considered the best buy date 
      since no possible sell dates come after it. (unless a new fetch is done)
    */
    let buyDateIndex: number = 0;
    let sellDateIndex: number = 0;
    let profit: number = 0;

    let buyAndSellDates: Array<BuyAndSellDates> = [];
    let profits: Array<Profits> = [];

    /*
      These nested loops will compare each of the days and will find all
      the possible buy and sell dates in the date range 
      and push them into the buyAndSellDates array.
    */
    for (let i=0; i < prices.length; i++) { 
      buyDateIndex = i;

      for (let j=i; j < prices.length; j++) {
        if (prices[j][1] > prices[i][1]) {
          sellDateIndex = j;
          buyAndSellDates.push({
            buyDateIndex,
            sellDateIndex,
          });
        }
      }
    }

    /*
      This loop calculates the profit from all the possible buy and sell dates and pushes these
      profits as well as the buy and sell date indexes into the profits array which will be returned.
    */
    for (let i=0; i < buyAndSellDates.length; i++) {
      profit = prices[buyAndSellDates[i].sellDateIndex][1] - prices[buyAndSellDates[i].buyDateIndex][1];
      buyDateIndex = buyAndSellDates[i].buyDateIndex;
      sellDateIndex = buyAndSellDates[i].sellDateIndex;
      profits.push({
        profit,
        buyDateIndex,
        sellDateIndex,
      })
    }
    return profits;
  }
}