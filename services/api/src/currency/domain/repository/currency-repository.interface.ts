import { Nullable } from "src/utils";
import { Currency } from "../models/currency";

export interface ICurrencyRepository {
  subscribe(currency: Currency): Promise<void>;
  findAllSubscriptions(): Promise<Currency[]>;
  findByCode(code: string): Promise<Nullable<Currency>>;
  changeSubscription(currency: Currency): Promise<void>;
  findSubscribedByCodeForex(code: string): Promise<Nullable<Currency>>;
  findAllSubscribedForex(): Promise<Currency[]>;
}
