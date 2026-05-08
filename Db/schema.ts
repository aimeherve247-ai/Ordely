import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Enums ───
export const roleEnum = pgEnum("role", ["owner", "manager", "chef", "cashier", "bartender", "server"]);
export const planTypeEnum = pgEnum("plan_type", ["free", "pro", "business"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "preparing", "ready", "paid", "cancelled"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cash", "mobile_money", "card"]);

// ─── Businesses (Tenants) ───
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  themeColor: varchar("theme_color", { length: 50 }).default("#E11D48"),
  isActive: boolean("is_active").default(true).notNull(),
  planType: planTypeEnum("plan_type").default("free").notNull(),
  maxTables: integer("max_tables").default(20),
  maxStaff: integer("max_staff").default(10),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;

// ─── Business Users (lien user <-> business) ───
export const businessUsers = pgTable("business_users", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(), // Supabase auth user_id
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  role: roleEnum("role").default("manager").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
});

export type BusinessUser = typeof businessUsers.$inferSelect;
export type InsertBusinessUser = typeof businessUsers.$inferInsert;

// ─── Users ───
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  supabaseUid: uuid("supabase_uid").notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: varchar("role", { length: 50 }).default("user").notNull(), // super_admin, user
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Products ───
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  image: text("image"),
  badge: varchar("badge", { length: 50 }),
  isAvailable: boolean("is_available").default(true).notNull(),
  stockQuantity: integer("stock_quantity").default(0),
  minStockLevel: integer("min_stock_level").default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ─── Orders ───
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  tableNumber: integer("table_number").notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: integer("total_amount").notNull(),
  paymentMethod: paymentMethodEnum("payment_method"),
  items: jsonb("items").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─── Staff ───
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  role: roleEnum("role").default("server").notNull(),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = typeof staff.$inferInsert;

// ─── Activity Log ───
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

// ─── Categories ───
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  sortOrder: integer("sort_order").default(0),
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
