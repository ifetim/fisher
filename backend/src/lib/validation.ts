const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationIssue {
  field: string;
  message: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePassword(password: string): string {
  return password.trim();
}

export function validateEmail(email: unknown): ValidationIssue | null {
  if (typeof email !== "string" || !email.trim()) {
    return { field: "email", message: "Email is required." };
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return { field: "email", message: "Please enter a valid email address." };
  }
  return null;
}

export function validatePassword(password: unknown): ValidationIssue | null {
  if (typeof password !== "string" || !password.trim()) {
    return { field: "password", message: "Password is required." };
  }
  if (password.trim().length < 6) {
    return {
      field: "password",
      message: "Password must be at least 6 characters.",
    };
  }
  return null;
}

export function validateName(name: unknown): ValidationIssue | null {
  if (typeof name !== "string" || !name.trim()) {
    return { field: "name", message: "Name is required." };
  }
  if (name.trim().length < 2) {
    return {
      field: "name",
      message: "Name must be at least 2 characters.",
    };
  }
  return null;
}

export function avatarFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function toPublicUser(user: {
  id: number;
  name: string;
  email: string;
  avatar: string;
}): { id: number; name: string; email: string; avatar: string } {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}
