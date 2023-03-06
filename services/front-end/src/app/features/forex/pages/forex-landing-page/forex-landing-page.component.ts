import { Component, OnInit } from '@angular/core';
import { Currency } from '../currency';
import { CURRENCYLIST } from '../currency-list';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-forex-landing-page',
  templateUrl: './forex-landing-page.component.html',
  styleUrls: ['./forex-landing-page.component.scss']
})

export class ForexLandingPageComponent implements OnInit {

  currencies: Currency[] = [];

  constructor(
    private currencyService: CurrencyService,
  ) { }

  ngOnInit(): void {
    this.getCurrencies();
  }

  getCurrencies(): void {
    this.currencyService.getCurrencies()
      .subscribe(currencies => this.currencies = currencies);
  }

  addCurrencySubscription(_code: string): void {
    _code = _code.trim();
    if (!_code || typeof CURRENCYLIST[_code] === "undefined") { return; }
    this.currencyService.addCurrency( { _code } as Currency)
      .subscribe(currency => {
        if (typeof currency !== "undefined") this.currencies.push(currency);
      });
  }

  removeCurrencySubscription(currency: Currency): void {
    this.currencies = this.currencies.filter(h => h !== currency);
    this.currencyService.updateCurrency(currency).subscribe();
  }

}


