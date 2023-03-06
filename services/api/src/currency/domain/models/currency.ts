import { Types } from "mongoose";
import {
  CurrencyAlreadySubscribedError,
  CurrencyNotSubscribedError,
  IncorrectCurrencyError,
} from "../errors";

export class Currency {
  private _id: Types.ObjectId;
  private _code: string;
  private _hasSubscription: boolean;
  private _forex: string;

  private constructor({ id, code, hasSubscription, forex }) {
    this._id = id;
    this._code = code;
    this._hasSubscription = hasSubscription;
    this._forex = forex;
  }

  static fromPrimitives({ id, code, hasSubscription, forex }) {
    return new Currency({
      id: id,
      code: code,
      hasSubscription: hasSubscription,
      forex: forex,
    });
  }

  static create({ id = new Types.ObjectId(), code, hasSubscription = true, forex = "{}" }) {
    if (!code) {
      return IncorrectCurrencyError.withCode(code);
    }

    return new Currency({
      id: id,
      code: code,
      hasSubscription: hasSubscription,
      forex: forex,
    });
  }

  get id(): Types.ObjectId {
    return this._id;
  }

  get code(): string {
    return this._code;
  }

  get hasSubscription(): boolean {
    return this._hasSubscription;
  }

  get forex(): string {
    return this._forex;
  }

  subscribe() {
    if (this.hasSubscription) {
      return CurrencyAlreadySubscribedError.withCode(this._code);
    }

    this._hasSubscription = true;
  }

  unsubscribe() {
    if (!this.hasSubscription) {
      return CurrencyNotSubscribedError.withCode(this._code);
    }

    this._hasSubscription = false;
  }
}
