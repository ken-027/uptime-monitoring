import { user, monitor, monitorLog, alert, subscription, siteAnalysis } from '@/db/schema';

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Monitor = typeof monitor.$inferSelect;
export type NewMonitor = typeof monitor.$inferInsert;

export type MonitorLog = typeof monitorLog.$inferSelect;
export type NewMonitorLog = typeof monitorLog.$inferInsert;

export type Alert = typeof alert.$inferSelect;
export type NewAlert = typeof alert.$inferInsert;

export type Subscription = typeof subscription.$inferSelect;
export type NewSubscription = typeof subscription.$inferInsert;

export type SiteAnalysis = typeof siteAnalysis.$inferSelect;
export type NewSiteAnalysis = typeof siteAnalysis.$inferInsert;
