/*
  This component creates and handles the input form 
  that is used to decide the parameters for the API call
*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormDataService } from '../services/formData.service';
import { CurrenciesService } from '../services/currencies.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  requestForm!: FormGroup;
  cryptoCurrencies: Array<string> = [];
  fiatCurrencies: Array<string> = [];
  formInvalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private formdataservice: FormDataService,
    private currenciesService: CurrenciesService
    ) { }

  ngOnInit(): void {
    this.createRequestForm();

    //get the currencies for the form selector from the currencies service
    this.cryptoCurrencies = this.currenciesService.getCrypto();
    this.fiatCurrencies = this.currenciesService.getFiat();
  }

  createRequestForm() {
    this.requestForm = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      crypto: [null, [Validators.required]],
      fiat: [null, [Validators.required]],
    })
  }

  onSubmit(formData: any) {
    //submits the parameters input in the form to the handle api data -component via form data service
    if (this.requestForm.invalid) {
      this.formInvalid = true;
      return;
    } else {
      this.formInvalid = false;
      this.formdataservice.sendFormData({
        startDate: formData.startDate,
        endDate: formData.endDate,
        crypto: formData.crypto,
        fiat: formData.fiat,
      });  
    }
  }
}
