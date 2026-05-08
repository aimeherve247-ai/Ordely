import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const ordersRouter = createRouter({
  list: publicQuery
    .input(z.object({ businessId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      if (input.businessId) {
        return db
          .select()
          .from(orders)
          .where(eq(orders.businessId, input.businessId))
          .orderBy(desc(orders.createdAt));
      }
      return db.select().from(orders).orderBy(desc(orders.createdAt));
    }),

  byStatus: publicQuery
    .input(z.object({ businessId: z.number().optional(), status: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [sql`${orders.status} = ${input.status}`];
      if (input.businessId) {
        conditions.push(eq(orders.businessId, input.businessId));
      }
      return db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt));
    }),

  create: publicQuery
    .input(
      z.object({
        businessId: z.number(),
        tableNumber: z.number(),
        customerName: z.string(),
        items: z.array(
          z.object({
            productId: z.number(),
            name: z.string(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
        totalAmount: z.number(),
        paymentMethod: z.enum(["cash", "mobile_money", "card"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(orders).values({
        businessId: input.businessId,
        tableNumber: input.tableNumber,
        customerName: input.customerName,
        items: input.items,
        totalAmount: input.totalAmount,
        paymentMethod: input.paymentMethod || null,
        status: "pending",
      }).returning();
      return result;
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "preparing", "ready", "paid", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(orders).where(eq(orders.id, input.id));
      return { success: true };
    }),

  stats: publicQuery
    .input(z.object({ businessId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const allOrders = input.businessId
        ? await db.select().from(orders).where(eq(orders.businessId, input.businessId))
        : await db.select().from(orders);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayRevenue = allOrders
        .filter((o) => o.status === "paid" && new Date(o.createdAt) >= today)
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const activeOrders = allOrders.filter(
        (o) => o.status === "pending" || o.status === "preparing" || o.status === "ready"
      ).length;

      return { todayRevenue, activeOrders, totalOrders: allOrders.length };
    }),
});
