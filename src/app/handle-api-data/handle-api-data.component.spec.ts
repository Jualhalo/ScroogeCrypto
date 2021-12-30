import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketChartRange } from '../interfaces/marketChartRange';
import { HandleApiDataComponent } from './handle-api-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import mockdataJson from './testMockData/mockdata.json';
import mockdataEmptyJson from './testMockData/mockdataEmpty.json'
import mockdataOneDayJson from './testMockData/mockdataOneDay.json';
import mockdataYearJson from './testMockData/mockdataYear.json';
import mockdataDecreasingPriceJson from './testMockData/mockdataDecreasingPrice.json'

describe('TestComponent', () => {
  let component: HandleApiDataComponent;
  let fixture: ComponentFixture<HandleApiDataComponent>;

  //data from 2020-03-01 - 2020-03-19
  const mockAPIdata: MarketChartRange = mockdataJson;

  const mockAPIdataEmpty: MarketChartRange = mockdataEmptyJson;
  const mockAPIdataOneDay: MarketChartRange = mockdataOneDayJson;

  //data from 2020
  const mockAPIdataYear: MarketChartRange = mockdataYearJson;

  //data from 2020-02-24 to 2020-03-02, during this time the price only decreases
  const mockAPIdataDecreasingPrice: MarketChartRange = mockdataDecreasingPriceJson;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DatePipe ],
      declarations: [ HandleApiDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleApiDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  /*
    Testing handleAPIData method. The method should
    be able to correctly determine if the received data has any 
    values in it or if the data is empty.
  */
  it('testing handleAPIData', () => {
    component.handleAPIData(mockAPIdata);
    expect(component.dataIsEmpty).toBeFalsy();
    expect(component.haveResults).toBeTruthy();
    component.handleAPIData(mockAPIdataEmpty);
    expect(component.dataIsEmpty).toBeTruthy();
  });

  it('testing finding longest bearish trend', () => {
    component.findLongestBearishTrend(mockAPIdata);
    expect(component.results.longestBearishTrendLength).toBe(3);
    expect(component.results.longestBearishTrendStart).toBe('2020-03-06');
    expect(component.results.longestBearishTrendEnd).toBe('2020-03-09');
  });

  it('testing finding the highest trading volume', () => {
    component.findHighestTradingVolume(mockAPIdata);
    expect(component.results.highestTradingVolumeDate).toBe('2020-03-13');
    expect(component.results.highestTradingVolumeValue).toBe(63031065653.37);
  });

  /*
    Test finding the best buy and sell dates. While the date 2020-03-19 is the day
    of lowest price in the mock data, it should not be considered the best buy date 
    since it's the last day in the date range.

    doNotBuyOrSell variable is tested using a mockdata where the daily price only
    decreases.
  */
  it('testing finding the best buy and sell dates', () => {
    component.findBestDaysToBuyAndSell(mockAPIdata);
    expect(component.results.bestBuyDate).toBe('2020-03-16');
    expect(component.results.bestSellDate).toBe('2020-03-17');
    expect(component.results.doNotBuyOrSell).toBeFalsy;
    component.findBestDaysToBuyAndSell(mockAPIdataDecreasingPrice);
    expect(component.results.doNotBuyOrSell).toBeTruthy;
  })

  /* 
    Test handling data granularity with 3 jsons of different length.
    Note that the year long mock data is from 2020, which was a leap year.
    Therefore the expected length is 366 instead of 365.
  */
  it('testing handling data granularity', () => {
    expect(component.handleDataGranularity(mockAPIdata.prices).length).toBe(18);
    expect(component.handleDataGranularity(mockAPIdataOneDay.prices).length).toBe(1);
    expect(component.handleDataGranularity(mockAPIdataYear.prices).length).toBe(366);
  })
});
