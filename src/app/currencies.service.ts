import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {
  /*
    Selectable currency parameters required for the API url.
    For now contains only the currencies needed for this assignment.
    To search using other currencies, add them to the arrays below.
    For testing purposes, ethereum and usd were added, but commented out later
  */
  cryptoCurrencies = [
    'bitcoin',
    //'ethereum',
  ];

  fiatCurrencies = [
    'eur',
    //'usd',
  ];

  constructor() { }

  getCrypto() {
    return this.cryptoCurrencies;
  }

  getFiat() {
    return this.fiatCurrencies;
  }
}
