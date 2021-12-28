/*
  This service is used to convert the dates from the input field into unix time stamps
  for the api call. It's also used to convert unix time stamps back into a more readable
  date format, when the api response has been handled.
*/
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConvertUnixDateService {

  constructor(
    private datePipe: DatePipe,
  ) { }

  convertDateToUnixStamp(date: Date) {
    /*
      Converts a date into unix time stamp. The stamp needs to be divided by 1000
      to remove milliseconds from it, since the api only accepts seconds as the parameter.
    */
    const unixDate = (new Date(date).getTime() / 1000).toFixed(0);
    return unixDate;
  }

  convertUnixStampToDate(stamp: number) {
    /*
      Converts a unix time stamp into date format. After this, DatePipe is used to convert
      the date into better readable format, omitting unnecessary info such as time of the day etc.
    */
    const date = new Date(stamp);
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
