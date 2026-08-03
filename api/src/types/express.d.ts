import type { User } from "../entities/User";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validatedEntity?: object;
    }
  }
}

export interface TypedRequest<T = unknown> extends ExpressRequest {
  user?: User;
  validatedEntity?: object;
  body: T;
}

export interface TypedResponse<T = unknown> extends ExpressResponse {}
