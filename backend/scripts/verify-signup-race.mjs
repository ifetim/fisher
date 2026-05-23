/**
 * Fires concurrent signups; without locking, users.json would lose entries.
 * Run from backend/: node scripts/verify-signup-race.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "../data/users.json");
const SEED = [
  {
    id: 1,
    name: "Fe Martinez",
    email: "fe@email.com",
    password: "password123",
    avatar: "FM",
  },
];

const CONCURRENT = 8;

async function resetUsers() {
  await writeFile(USERS_FILE, `${JSON.stringify(SEED, null, 2)}\n`, "utf-8");
}

async function runWithoutLock() {
  await resetUsers();
  const ts = Date.now();

  await Promise.all(
    Array.from({ length: CONCURRENT }, (_, i) =>
      (async () => {
        const raw = await readFile(USERS_FILE, "utf-8");
        const users = JSON.parse(raw);
        const email = `race-${ts}-${i}@test.com`;
        if (users.some((u) => u.email === email)) return;
        const nextId =
          users.length === 0 ? 1 : Math.max(...users.map((u) => u.id)) + 1;
        users.push({
          id: nextId,
          name: `User ${i}`,
          email,
          password: "password123",
          avatar: "U",
        });
        await writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf-8");
      })(),
    ),
  );

  const final = JSON.parse(await readFile(USERS_FILE, "utf-8"));
  const created = final.filter((u) => u.email.includes(`race-${ts}-`));
  return { created: created.length, expected: CONCURRENT };
}

async function main() {
  const { created, expected } = await runWithoutLock();
  console.log(
    `Unlocked read-modify-write: ${created}/${expected} users persisted (data loss if < expected)`,
  );
  if (created < expected) {
    console.log("Race confirmed: concurrent writes overwrote each other.");
  } else {
    console.log("No loss this run (race is timing-dependent); pattern is still unsafe.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
