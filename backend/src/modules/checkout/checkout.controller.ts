import { Request, Response, NextFunction } from "express";
import {
  checkoutArticle,
  checkoutApc,
  completeOrder,
  getOrderReceipt,
} from "./checkout.service.js";
import { sendSuccess } from "../../utils/apiResponse.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

export const articleCheckout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await checkoutArticle(req.user!.userId, param(req.params["doi"]));
    sendSuccess(res, { statusCode: 201, message: "Order created", data: result });
  } catch (err) {
    next(err);
  }
};

export const apcCheckout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await checkoutApc(req.user!.userId, param(req.params["submissionId"]));
    sendSuccess(res, { statusCode: 201, message: "APC order created", data: result });
  } catch (err) {
    next(err);
  }
};

export const completeOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { receiptUrl } = req.body as { receiptUrl?: string };
    const result = await completeOrder(req.user!.userId, param(req.params["id"]), receiptUrl);
    sendSuccess(res, { statusCode: 200, message: "Order completed", data: result });
  } catch (err) {
    next(err);
  }
};

export const orderReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const receipt = await getOrderReceipt(req.user!.userId, param(req.params["id"]));
    sendSuccess(res, { statusCode: 200, message: "Order receipt", data: receipt });
  } catch (err) {
    next(err);
  }
};
