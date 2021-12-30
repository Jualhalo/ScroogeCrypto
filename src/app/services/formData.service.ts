import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MarketChartRangeParameter } from '../interfaces/marketChartRangeParameter';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  /*
    This is an observable that a component can subscribe to.
    Whenever this variable is re-assigned, the subscribing
    component will receive and handle the new data.
  */
  private formDataSource = new Subject<MarketChartRangeParameter>();
  formData$ = this.formDataSource.asObservable();

  constructor() { }

  sendFormData(data: MarketChartRangeParameter) {
    /*
      When the user submits the form data, this method is called.
    */
    this.formDataSource.next(data);
  }
}
