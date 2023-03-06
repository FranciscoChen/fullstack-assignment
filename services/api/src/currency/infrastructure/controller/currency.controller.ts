import { Request, Response } from "express";
import {
  GetSubscribedCurrencies,
  SubscribeCurrency,
  UnsubscribeCurrency,
  GetCurrencyHistory,
  GetAllCurrenciesHistory,
} from "@app/currency/application";
import { DomainError } from "@app/utils";
import { CURRENCYLIST } from "./currency-list";

export class CurrencyController {
  private subscribeCurrency = new SubscribeCurrency({});
  private getSubscribedCurrencies = new GetSubscribedCurrencies({});
  private unsubscribeCurrency = new UnsubscribeCurrency({});
  private getCurrencyHistory = new GetCurrencyHistory({});
  private getAllCurrenciesHistory = new GetAllCurrenciesHistory({});

  async subscribe(req: Request, res: Response) {
    try {
      if (typeof CURRENCYLIST[req.body._code] === "undefined") {
        res.status(400).json({ data: "Bad currency code" });
      } else {
        const currency = await this.subscribeCurrency.execute(req.body);
        res.status(200).json( currency );
      }
    } catch (err) {
      let status = 500;
      if (err instanceof DomainError) {
        status = 400;
      }
      res.status(status).json({ data: err.message });
    }
  }

  async findAllSubscribedCurrencies(req: Request, res: Response) {
    try {
      const currencies = await this.getSubscribedCurrencies.execute();
      var len = currencies.length;
      res.status(200).json( currencies );
    } catch (err) {
      let status = 500;
      if (err instanceof DomainError) {
        status = 400;
      }
      res.status(status).json({ data: err.message });
    }
  }

  async unsubscribe(req: Request, res: Response) {
    try {
      const currency = await this.unsubscribeCurrency.execute(req.params.code);
      res.status(200).json( currency );
    } catch (err) {
      let status = 500;
      if (err instanceof DomainError) {
        status = 400;
      }
      res.status(status).json({ data: err.message });
    }
  }

  async retrieveCurrencyHistory(req: Request, res: Response) {
    try {
      const currencyHistory = await this.getCurrencyHistory.execute(req.params.code);
      res.status(200).json( currencyHistory );
    } catch (err) {
      let status = 500;
      if (err instanceof DomainError) {
        status = 400;
      }
      res.status(status).json({ data: err.message });
    }
  }

  async retrieveAllCurrenciesHistory(req: Request, res: Response) {
    try {
      const currenciesHistory = await this.getAllCurrenciesHistory.execute();
      res.status(200).json( currenciesHistory );
    } catch (err) {
      let status = 500;
      if (err instanceof DomainError) {
        status = 400;
      }
      res.status(status).json({ data: err.message });
    }
  }
}
