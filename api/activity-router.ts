import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { activityLog } from "db/schema";
import { eq, desc } from "drizzle-orm";

export const activityRouter = createRouter({
  list: publicQuery
    .input(z.object({ businessId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      if (input.businessId) {
        return db
          .select()
          .from(activityLog)
          .where(eq(activityLog.businessId, input.businessId))
          .orderBy(desc(activityLog.createdAt))
          .limit(20);
      }
      return db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(20);
    }),

  create: publicQuery
    .input(
      z.object({
        businessId: z.number(),
        type: z.string(),
        message: z.string(),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(activityLog).values({
        businessId: input.businessId,
        type: input.type,
        message: input.message,
        metadata: input.metadata || null,
      }).returning();
      return result;
    }),
});
