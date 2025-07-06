import { pgTable, varchar, integer, timestamp, pgEnum, text, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';
import { AppStatus, SubscriptionPlan } from '@/enum/app.enum';

export const appStatus = pgEnum('app_status', [AppStatus.UP, AppStatus.DOWN]);
export const subsPlan = pgEnum('subscription_plan', [
  SubscriptionPlan.FREE,
  SubscriptionPlan.PRO,
  SubscriptionPlan.ENTERPRISE,
]);

export const monitor = pgTable('monitor', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  name: varchar('name', { length: 255 }),
  url: varchar('url', { length: 2048 }).notNull(),
  interval: integer('interval').notNull(),
  lastStatus: varchar('last_status', { length: 10 }).default('unknown'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const monitorLog = pgTable('monitor_log', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  monitorId: uuid('monitor_id')
    .references(() => monitor.id)
    .notNull(),
  status: appStatus(),
  responseTime: integer('response_time').notNull(),
  checkedAt: timestamp('checked_at').defaultNow().notNull(),
});

export const subscription = pgTable('subscription', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull()
    .unique(),
  stripeId: varchar('stripe_id', { length: 255 }).unique(),
  plan: subsPlan(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const siteAnalysis = pgTable('site_analysis', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  monitorId: uuid('monitor_id')
    .references(() => monitor.id)
    .notNull(),
  siteType: text('site_type').notNull(),
  tech: text('tech').notNull(),
  seoIssue: text('seo_issue').notNull(),
  brokenLink: text('broken_link').notNull(),
  performance: text('performance').notNull(),
  security: text('security').notNull(),
  status: appStatus(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
