import { relations } from "drizzle-orm";
import { users, tiers, upgradeRequests, walletBindings, withdrawals, miningHistory, referralEarnings, notifications } from "./schema.js";

export const usersRelations = relations(users, ({ many, one }) => ({
  upgrades: many(upgradeRequests),
  withdrawals: many(withdrawals),
  wallets: many(walletBindings),
  miningHistory: many(miningHistory),
  referralsEarned: many(referralEarnings, { relationName: "referrer" }),
  notifications: many(notifications),
  currentTier: one(tiers, { fields: [users.currentTierId], references: [tiers.id] }),
}));

export const tiersRelations = relations(tiers, ({ many }) => ({
  upgrades: many(upgradeRequests),
  miningHistory: many(miningHistory),
}));

export const upgradeRequestsRelations = relations(upgradeRequests, ({ one }) => ({
  user: one(users, { fields: [upgradeRequests.userId], references: [users.id] }),
  tier: one(tiers, { fields: [upgradeRequests.tierId], references: [tiers.id] }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  user: one(users, { fields: [withdrawals.userId], references: [users.id] }),
}));

export const miningHistoryRelations = relations(miningHistory, ({ one }) => ({
  user: one(users, { fields: [miningHistory.userId], references: [users.id] }),
  tier: one(tiers, { fields: [miningHistory.tierId], references: [tiers.id] }),
}));

export const referralEarningsRelations = relations(referralEarnings, ({ one }) => ({
  referrer: one(users, { fields: [referralEarnings.referrerId], references: [users.id], relationName: "referrer" }),
  referred: one(users, { fields: [referralEarnings.referredId], references: [users.id] }),
}));
