/*
  This service does the API data fetches and error handling.
  If the app is expanded with new features, this can likely still be used as it is,
  to make other types of api calls as well.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchAPIDataService {

  constructor(private http: HttpClient) { }

  fetchAPIData(url: string): Observable<any> { 
    /*
      This method takes in a url parameter and does the API fetch 
      from that url and returns an observable with the response data,
      that a component can subscribe to. If any errors occur, 
      they will be handled by the handleError method and the error will
      be returned to the subscribing component instead.
    */
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    /*
      Converts the error into a more readable format,
      that can be displayed to the user.
    */
    let errorMessage: string = '';
    if (error.status === 0) {
      errorMessage = 'An error occurred:' + error.error;
    } else {
      errorMessage = 'Server returned code ' + error.status
    }
    return throwError(()=> new Error(errorMessage));
  }
}
