import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormDataService } from '../formData.service';
import { CurrenciesService } from '../currencies.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  requestForm!: FormGroup;
  cryptoCurrencies: Array<string> = [];
  fiatCurrencies: Array<string> = [];

  constructor(
    private fb: FormBuilder,
    private formdataservice: FormDataService,
    private currenciesService: CurrenciesService
    ) { }

  ngOnInit(): void {
    this.createRequestForm();
    this.cryptoCurrencies = this.currenciesService.getCrypto();
    this.fiatCurrencies = this.currenciesService.getFiat();
  }

  createRequestForm() {
    this.requestForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      crypto: [null],
      fiat: [null],
    })
  }

  onSubmit(formData: any) {
    this.formdataservice.sendFormData({
      startDate: formData.startDate,
      endDate: formData.endDate,
      crypto: formData.crypto,
      fiat: formData.fiat,
    });  
  }
}
