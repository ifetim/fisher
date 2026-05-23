import cors from "cors";
import express from "express";
import platformAuthRouter from "./routes/platformAuth.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "clearmint-backend" });
});

/** Platform auth (Screen 1, type 1). Bank auth routes will live under /api/auth/bank later. */
app.use("/api/auth/platform", platformAuthRouter);

app.listen(PORT, () => {
  console.log(`ClearMint backend listening on http://localhost:${PORT}`);
});
