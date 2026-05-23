import { Router, type Request, type Response } from "express";
import {
  normalizeEmail,
  normalizePassword,
  toPublicUser,
  validateEmail,
  validateName,
  validatePassword,
} from "../lib/validation.js";
import { createUser, findUserByEmail } from "../services/userStore.js";
import type { AuthErrorCode } from "../types/user.js";

const router = Router();

function sendError(
  res: Response,
  status: number,
  code: AuthErrorCode,
  message: string,
  details?: { field: string; message: string }[],
): void {
  res.status(status).json({
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  });
}

/** Screen 1 — platform login (ClearMint account). Bank login will be a separate route later. */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  const issues = [validateEmail(email), validatePassword(password)].filter(
    (issue): issue is NonNullable<typeof issue> => issue !== null,
  );

  if (issues.length > 0) {
    sendError(res, 400, "VALIDATION_ERROR", "Invalid login details.", issues);
    return;
  }

  try {
    const user = await findUserByEmail(email as string);

    if (!user) {
      sendError(
        res,
        401,
        "EMAIL_NOT_FOUND",
        "No account found with this email. Please sign up or check your email.",
      );
      return;
    }

    if (user.password !== normalizePassword(password as string)) {
      sendError(res, 401, "WRONG_PASSWORD", "Incorrect password. Please try again.");
      return;
    }

    res.json({
      success: true,
      user: toPublicUser(user),
    });
  } catch {
    sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Something went wrong. Please try again.",
    );
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};

  const issues = [
    validateName(name),
    validateEmail(email),
    validatePassword(password),
  ].filter((issue): issue is NonNullable<typeof issue> => issue !== null);

  if (issues.length > 0) {
    sendError(res, 400, "VALIDATION_ERROR", "Invalid sign-up details.", issues);
    return;
  }

  try {
    const user = await createUser({
      name: name as string,
      email: normalizeEmail(email as string),
      password: normalizePassword(password as string),
    });

    res.status(201).json({
      success: true,
      user: toPublicUser(user),
    });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_ALREADY_EXISTS") {
      sendError(
        res,
        409,
        "EMAIL_ALREADY_EXISTS",
        "An account with this email already exists. Try logging in instead.",
      );
      return;
    }

    sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Something went wrong. Please try again.",
    );
  }
});

export default router;
