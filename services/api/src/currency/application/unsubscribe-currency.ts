import { CurrencyDoesNotExistError, ICurrencyRepository } from "../domain";
import { MongooseCurrencyRepository } from "../infrastructure";

export class UnsubscribeCurrency {
  private currencyRepository: ICurrencyRepository;
  constructor({ currencyRepository = new MongooseCurrencyRepository() }) {
    this.currencyRepository = currencyRepository;
  }

  async execute(_code: string) {
    const currency = await this.currencyRepository.findByCode(_code);
    if (!currency) {
      return CurrencyDoesNotExistError.withCode(_code);
    }

    currency.unsubscribe();
    await this.currencyRepository.changeSubscription(currency);
    return currency;
  }
}
