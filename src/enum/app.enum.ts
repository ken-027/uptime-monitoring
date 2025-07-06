export enum AppStatus {
  UP = 'up',
  DOWN = 'down',
  PAUSE = 'pause',
  UNKNOWN = 'unknown',
}

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionPrice {
  PRO = 1000,
  ENTERPRISE = 2500,
}

export enum TotalPlan {
  FREE = 2,
  PRO = 4,
  ENTERPRISE = 6
}

export enum HourlyPlan {
  HOURLY = 1,
  QUARTERLY = 6,
  HALF_DAY = 12,
  DAILY = 24,
}
