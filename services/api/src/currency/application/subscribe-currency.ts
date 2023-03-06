import {
  Currency,
  CurrencyAlreadySubscribedError,
  ICurrencyRepository,
} from "../domain";
import { MongooseCurrencyRepository } from "../infrastructure";

export class SubscribeCurrency {
  private currencyRepository: ICurrencyRepository;
  constructor({ currencyRepository = new MongooseCurrencyRepository() }) {
    this.currencyRepository = currencyRepository;
  }

  async execute(currencyReq) {
    const currency = await this.currencyRepository.findByCode(currencyReq._code);

    if (currency) {
      currency.subscribe();
      await this.currencyRepository.changeSubscription(currency);
      return currency;
    }

    const newCurrency = Currency.create({ code: currencyReq._code });
    await this.currencyRepository.subscribe(newCurrency as Currency);
    return newCurrency;
  }
}
