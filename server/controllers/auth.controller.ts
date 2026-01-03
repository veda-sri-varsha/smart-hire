import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import type { AuthUserResponse } from "../types/auth.types";
import ApiResponse from "../utils/api-response";
import handler from "../utils/handler";
import {
  signupSchema,
  loginSchema,
} from "../validations/auth.vaildators";

export const signup = handler(async (req: Request, res: Response) => {
  const { email, name, password } = signupSchema.parse(req.body);

  const user = await authService.signup(email, name, password);

  return ApiResponse.success<AuthUserResponse>(
    "User registered successfully",
    user
  ).send(res, 201);
});

export const login = handler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await authService.login(email, password);

  return ApiResponse.success<AuthUserResponse>("Login successful", user).send(
    res,
    200
  );
});
