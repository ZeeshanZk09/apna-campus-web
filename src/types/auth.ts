import type { JwtPayload } from "jsonwebtoken";

export type Term = "register" | "login";

export type VerifyTokenResult = {
  payload: JwtPayload;
  error: unknown;
  valid: boolean;
};
