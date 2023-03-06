import { Currency, ICurrencyRepository } from "@app/currency/domain";
import { Nullable } from "@app/utils";
import CurrencySchema from "../schema/mongoose-currency.schema";
export class MongooseCurrencyRepository implements ICurrencyRepository {
  private toDomain(currencyDB) {
    return Currency.fromPrimitives({
      id: currencyDB._id,
      code: currencyDB.code,
      hasSubscription: currencyDB.hasSubscription,
      forex: currencyDB.forex,
    });
  }

  private fromDomain(currency: Currency) {
    return {
      _id: currency.id,
      code: currency.code,
      hasSubscription: currency.hasSubscription,
      forex: currency.forex,
    };
  }

  async subscribe(currency: Currency): Promise<void> {
    const mongooseCurrency = this.fromDomain(currency);
    await CurrencySchema.create(mongooseCurrency);
  }

  async findAllSubscriptions(): Promise<Currency[]> {
    const subscribedCurrencies = await CurrencySchema.find({
      hasSubscription: true,
    });

    var subscriptions = [];
    const len = subscribedCurrencies.length;

    for (var i = 0; i < len; ++i) {
      subscriptions.push( this.toDomain(subscribedCurrencies[i]) );
    }

    //return subscribedCurrencies.map((currency) => this.toDomain(currency));
    return subscriptions;
  }

  async findByCode(code: string): Promise<Nullable<Currency>> {
    const currency = await CurrencySchema.findOne({ code: code });
    return currency === null ? null : this.toDomain(currency);
  }

  async changeSubscription(currency: Currency): Promise<void> {
    const document = this.fromDomain(currency);
    await CurrencySchema.updateOne({ _id: currency.id }, { $set: document });
  }

  async findAllSubscribedForex(): Promise<Currency[]> {
    const subscribedCurrencies= await CurrencySchema.find({
      hasSubscription: true,
    });

    return subscribedCurrencies.map((currency) => this.toDomain(currency));
  }

  async findSubscribedByCodeForex(code: string): Promise<Nullable<Currency>> {
    const currency = await CurrencySchema.findOne({ code: code, hasSubscription: true, });
    return currency === null ? null : this.toDomain(currency);
  }
}
