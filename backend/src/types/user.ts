export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

/** Safe user shape returned to the client (no password). */
export interface PublicUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export type AuthErrorCode =
  | "VALIDATION_ERROR"
  | "EMAIL_NOT_FOUND"
  | "WRONG_PASSWORD"
  | "EMAIL_ALREADY_EXISTS"
  | "INTERNAL_ERROR";
