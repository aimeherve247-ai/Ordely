import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories } from "db/schema";
import { eq, asc } from "drizzle-orm";

export const categoriesRouter = createRouter({
  list: publicQuery
    .input(z.object({ businessId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      if (input.businessId) {
        return db
          .select()
          .from(categories)
          .where(eq(categories.businessId, input.businessId))
          .orderBy(asc(categories.sortOrder));
      }
      return db.select().from(categories).orderBy(asc(categories.sortOrder));
    }),

  create: publicQuery
    .input(
      z.object({
        businessId: z.number(),
        name: z.string(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(categories).values({
        businessId: input.businessId,
        name: input.name,
        sortOrder: input.sortOrder || 0,
      }).returning();
      return result;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        sortOrder: z.number().optional(),
        isVisible: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(categories).set(data).where(eq(categories.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
