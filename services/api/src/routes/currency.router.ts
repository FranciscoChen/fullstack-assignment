import { Request, Response, Router } from "express";
import { CurrencyController } from "@app/currency";

const currencyRouter: Router = Router();
const currencyController = new CurrencyController();

currencyRouter.post("/api/currency", async (req: Request, res: Response) => {
  currencyController.subscribe(req, res);
});

currencyRouter.get("/api/currencies", async (req: Request, res: Response) => {
  currencyController.findAllSubscribedCurrencies(req, res);
});

currencyRouter.put(
  "/api/currency/:code",
  async (req: Request, res: Response) => {
    currencyController.unsubscribe(req, res);
  }
);

currencyRouter.get("/api/currencies/:code/history", async (req: Request, res: Response) => {
  currencyController.retrieveCurrencyHistory(req, res);
});

currencyRouter.get("/api/forex/history", async (req: Request, res: Response) => {
  currencyController.retrieveAllCurrenciesHistory(req, res);
});

export default currencyRouter;
