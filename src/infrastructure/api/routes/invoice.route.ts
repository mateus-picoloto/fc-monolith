import { Request, Response, Router } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRouter = Router();

invoiceRouter.get("/:id", async (req: Request, res: Response) => {
  const facade = InvoiceFacadeFactory.create();
  try {
    const output = await facade.find({
      id: req.params.id,
    });
    res.send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});
