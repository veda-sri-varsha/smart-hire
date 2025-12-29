import type { NextFunction, Request, Response } from "express";

export type AsyncHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<unknown>;

const handler =
	(fn: AsyncHandler) =>
	(req: Request, res: Response, next: NextFunction): void => {
		fn(req, res, next).catch(next);
	};

export default handler;
