import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { UserRecord } from "../types/user.js";
import {
  avatarFromName,
  normalizeEmail,
  normalizePassword,
} from "../lib/validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "../../data/users.json");

/** Serializes read-modify-write on users.json so concurrent signups cannot clobber each other. */
let storeMutex: Promise<void> = Promise.resolve();

async function withStoreLock<T>(task: () => Promise<T>): Promise<T> {
  let release!: () => void;
  const slot = new Promise<void>((resolve) => {
    release = resolve;
  });
  const previous = storeMutex;
  storeMutex = previous.then(() => slot);
  await previous;
  try {
    return await task();
  } finally {
    release();
  }
}

export async function readUsers(): Promise<UserRecord[]> {
  const raw = await readFile(USERS_FILE, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("users.json must contain an array");
  }
  return parsed as UserRecord[];
}

async function writeUsers(users: UserRecord[]): Promise<void> {
  const content = `${JSON.stringify(users, null, 2)}\n`;
  const tempFile = `${USERS_FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempFile, content, "utf-8");
  await rename(tempFile, USERS_FILE);
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | undefined> {
  const normalized = normalizeEmail(email);
  const users = await readUsers();
  return users.find((u) => normalizeEmail(u.email) === normalized);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord> {
  return withStoreLock(async () => {
    const users = await readUsers();
    const normalizedEmail = normalizeEmail(input.email);

    if (users.some((u) => normalizeEmail(u.email) === normalizedEmail)) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const nextId =
      users.length === 0 ? 1 : Math.max(...users.map((u) => u.id)) + 1;

    const user: UserRecord = {
      id: nextId,
      name: input.name.trim(),
      email: normalizedEmail,
      password: normalizePassword(input.password),
      avatar: avatarFromName(input.name),
    };

    users.push(user);
    await writeUsers(users);
    return user;
  });
}
