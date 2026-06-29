import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/apiResponse.js";
import { getProfile } from "./authors.service.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

export const getAuthorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getProfile(param(req.params["authorId"]));
    sendSuccess(res, { statusCode: 200, message: "Author profile retrieved", data });
  } catch (err) {
    next(err);
  }
};
