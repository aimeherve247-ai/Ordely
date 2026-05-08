import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { ordersRouter } from "./orders-router";
import { productsRouter } from "./products-router";
import { staffRouter } from "./staff-router";
import { activityRouter } from "./activity-router";
import { categoriesRouter } from "./categories-router";
import { businessesRouter } from "./businesses-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  orders: ordersRouter,
  products: productsRouter,
  staff: staffRouter,
  activity: activityRouter,
  categories: categoriesRouter,
  businesses: businessesRouter,
});

export type AppRouter = typeof appRouter;
