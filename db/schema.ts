import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  bigint,
  boolean,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended"]);
export const currencyEnum = pgEnum("currency", ["NGN", "USDT"]);
export const paymentMethodEnum = pgEnum("payment_method", ["bank_transfer", "usdt"]);
export const upgradeStatusEnum = pgEnum("upgrade_status", ["pending", "approved", "rejected"]);
export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["pending", "approved", "paid", "rejected"]);
export const referralSourceEnum = pgEnum("referral_source", ["upgrade", "mining"]);
export const notificationTypeEnum = pgEnum("notification_type", ["upgrade", "withdrawal", "mining", "referral", "system"]);
export const notificationStatusEnum = pgEnum("notification_status", ["unread", "read"]);

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 100 }).unique(),
  email: varchar("email", { length: 320 }).unique(),
  password: varchar("password", { length: 255 }),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("user").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  referralCode: varchar("referral_code", { length: 20 }).unique(),
  referredBy: bigint("referred_by", { mode: "number" }),
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0").notNull(),
  totalMined: decimal("total_mined", { precision: 18, scale: 8 }).default("0").notNull(),
  totalWithdrawn: decimal("total_withdrawn", { precision: 18, scale: 8 }).default("0").notNull(),
  currentTierId: bigint("current_tier_id", { mode: "number" }),
  minesToday: integer("mines_today").default(0).notNull(),
  lastMineAt: timestamp("last_mine_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tiers
export const tiers = pgTable("tiers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  level: integer("level").notNull().unique(),
  period: integer("period").notNull(),
  earnPerDay: decimal("earn_per_day", { precision: 18, scale: 8 }).notNull(),
  priceUsd: decimal("price_usd", { precision: 18, scale: 2 }).notNull(),
  priceNgn: decimal("price_ngn", { precision: 18, scale: 2 }).notNull(),
  priceGhs: decimal("price_ghs", { precision: 18, scale: 2 }).default("0").notNull(),
  minesPerDay: integer("mines_per_day").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Tier = typeof tiers.$inferSelect;

// Upgrade Requests
export const upgradeRequests = pgTable("upgrade_requests", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  tierId: bigint("tier_id", { mode: "number" }).notNull(),
  amountUsd: decimal("amount_usd", { precision: 18, scale: 2 }).notNull(),
  amountLocal: decimal("amount_local", { precision: 18, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  status: upgradeStatusEnum("status").default("pending").notNull(),
  proofImage: text("proof_image"),
  txHash: varchar("tx_hash", { length: 255 }),
  payerName: varchar("payer_name", { length: 255 }),
  reviewedBy: bigint("reviewed_by", { mode: "number" }),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UpgradeRequest = typeof upgradeRequests.$inferSelect;

// Wallet Bindings
export const walletBindings = pgTable("wallet_bindings", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  network: varchar("network", { length: 50 }).default("TRC20").notNull(),
  isDefault: boolean("is_default").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WalletBinding = typeof walletBindings.$inferSelect;

// Withdrawals
export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  network: varchar("network", { length: 50 }).default("TRC20").notNull(),
  status: withdrawalStatusEnum("status").default("pending").notNull(),
  reviewedBy: bigint("reviewed_by", { mode: "number" }),
  reviewedAt: timestamp("reviewed_at"),
  paidBy: bigint("paid_by", { mode: "number" }),
  paidAt: timestamp("paid_at"),
  paidTxHash: varchar("paid_tx_hash", { length: 255 }),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Withdrawal = typeof withdrawals.$inferSelect;

// Mining History
export const miningHistory = pgTable("mining_history", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  tierId: bigint("tier_id", { mode: "number" }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MiningHistoryRecord = typeof miningHistory.$inferSelect;

// Referral Earnings
export const referralEarnings = pgTable("referral_earnings", {
  id: serial("id").primaryKey(),
  referrerId: bigint("referrer_id", { mode: "number" }).notNull(),
  referredId: bigint("referred_id", { mode: "number" }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  tier: integer("tier").notNull(),
  source: referralSourceEnum("source").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ReferralEarning = typeof referralEarnings.$inferSelect;

// Settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Setting = typeof settings.$inferSelect;

// Admin Logs
export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  adminId: bigint("admin_id", { mode: "number" }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 50 }).notNull(),
  targetId: bigint("target_id", { mode: "number" }),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  status: notificationStatusEnum("status").default("unread").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
