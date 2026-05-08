import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const productsRouter = createRouter({
  list: publicQuery
    .input(z.object({ businessId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      if (input.businessId) {
        return db
          .select()
          .from(products)
          .where(eq(products.businessId, input.businessId))
          .orderBy(desc(products.createdAt));
      }
      return db.select().from(products).orderBy(desc(products.createdAt));
    }),

  byCategory: publicQuery
    .input(z.object({ businessId: z.number().optional(), category: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [sql`${products.category} = ${input.category}`];
      if (input.businessId) {
        conditions.push(eq(products.businessId, input.businessId));
      }
      return db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt));
    }),

  create: publicQuery
    .input(
      z.object({
        businessId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        category: z.string(),
        image: z.string().optional(),
        badge: z.string().optional(),
        stockQuantity: z.number().optional(),
        minStockLevel: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values({
        businessId: input.businessId,
        name: input.name,
        description: input.description || null,
        price: input.price,
        category: input.category,
        image: input.image || null,
        badge: input.badge || null,
        stockQuantity: input.stockQuantity || 0,
        minStockLevel: input.minStockLevel || 5,
      });
      return result;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        category: z.string().optional(),
        image: z.string().optional(),
        badge: z.string().optional(),
        isAvailable: z.boolean().optional(),
        stockQuantity: z.number().optional(),
        minStockLevel: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(products)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(products.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  lowStock: publicQuery
    .input(z.object({ businessId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const allProducts = input.businessId
        ? await db.select().from(products).where(eq(products.businessId, input.businessId))
        : await db.select().from(products);
      return allProducts.filter((p) => (p.stockQuantity || 0) <= (p.minStockLevel || 5));
    }),
});
