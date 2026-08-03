import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { sendError } from "./sendError";
import { plainToInstance } from "class-transformer";

export function inputValidation<T>(inputClass: new () => T) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const input = plainToInstance(inputClass, req.body);
    // const input = new inputClass();
    // Object.assign(input as object, req.body);
    const errors = await validate(input as object);

    if (errors.length > 0) {
      const errorMessages: string[] = errors
        .map((e) => Object.values(e.constraints || {}).flat())
        .flat();
      return sendError(res, 400, "validation error", errorMessages);
    }

    req.validatedEntity = input as object;
    next();
  };
}
