import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { staff } from "db/schema";
import { eq, desc } from "drizzle-orm";

export const staffRouter = createRouter({
  list: publicQuery
    .input(z.object({ businessId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      if (input.businessId) {
        return db
          .select()
          .from(staff)
          .where(eq(staff.businessId, input.businessId))
          .orderBy(desc(staff.createdAt));
      }
      return db.select().from(staff).orderBy(desc(staff.createdAt));
    }),

  create: publicQuery
    .input(
      z.object({
        businessId: z.number(),
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        role: z.enum(["owner", "manager", "server", "chef", "cashier", "bartender"]),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(staff).values({
        businessId: input.businessId,
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        role: input.role,
        avatar: input.avatar || null,
      }).returning();
      return result;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        role: z.enum(["owner", "manager", "server", "chef", "cashier", "bartender"]).optional(),
        avatar: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(staff)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(staff.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(staff).where(eq(staff.id, input.id));
      return { success: true };
    }),
});
