import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { businesses } from "db/schema";
import { eq, desc } from "drizzle-orm";

export const businessesRouter = createRouter({
  list: publicQuery
    .input(z.object({}).optional())
    .query(async () => {
    const db = getDb();
    return db.select().from(businesses).orderBy(desc(businesses.createdAt));
  }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(businesses)
        .where(eq(businesses.slug, input.slug));
      return result[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        themeColor: z.string().optional(),
        planType: z.enum(["free", "pro", "business"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(businesses).values({
        name: input.name,
        slug: input.slug,
        email: input.email || null,
        phone: input.phone || null,
        address: input.address || null,
        themeColor: input.themeColor || "#E11D48",
        planType: input.planType || "free",
      }).returning();
      return result;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        logo: z.string().optional(),
        themeColor: z.string().optional(),
        isActive: z.boolean().optional(),
        planType: z.enum(["free", "pro", "business"]).optional(),
        maxTables: z.number().optional(),
        maxStaff: z.number().optional(),
        settings: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(businesses)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(businesses.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(businesses).where(eq(businesses.id, input.id));
      return { success: true };
    }),

  stats: publicQuery
    .input(z.object({}).optional())
    .query(async () => {
    const db = getDb();
    const allBusinesses = await db.select().from(businesses);
    const active = allBusinesses.filter((b) => b.isActive).length;
    return {
      total: allBusinesses.length,
      active,
      inactive: allBusinesses.length - active,
    };
  }),
});
