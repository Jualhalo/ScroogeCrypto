import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchAPIDataService {

  constructor(private http: HttpClient) { }

  fetchAPIData(url: string): Observable<any> { 
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    if (error.status === 0) {
      errorMessage = 'An error occurred:' + error.error;
    } else {
      errorMessage = 'Server returned code ' + error.status
    }
    return throwError(()=> new Error(errorMessage));
  }
}
