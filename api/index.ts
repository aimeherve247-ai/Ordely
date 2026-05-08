import { Hono } from "hono";
import { handle } from "hono/vercel";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono().basePath("/api");

// tRPC handler
app.use("/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// Health check
app.get("/ping", (c) => c.json({ ok: true, ts: Date.now() }));

// 404 fallback
app.all("/*", (c) => c.json({ error: "Not Found" }, 404));

// Vercel adapter
export default handle(app);
