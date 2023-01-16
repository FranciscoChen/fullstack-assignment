import { Request, Response } from "express";
import {
  SubscribeCurrency,
  UnsubscribeCurrency,
} from "src/currency/application";
import { DomainError } from "src/utils/errors/domain.error";

export class CurrencyController {
  private subscribeCurrency = new SubscribeCurrency({});
  private unsubscribeCurrency = new UnsubscribeCurrency({});

  async subscribe(req: Request, res: Response) {
    try {
      const currency = await this.subscribeCurrency.execute(req.body);
      res.status(200).json({ data: currency });
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
      res.status(200).json({ data: currency });
    } catch (err) {
      let status = 500;
      if (err instanceof DomainError) {
        status = 400;
      }
      res.status(status).json({ data: err.message });
    }
  }
}
