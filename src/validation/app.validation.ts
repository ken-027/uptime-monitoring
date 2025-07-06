import { HourlyPlan } from '@/enum/app.enum';
import * as z from 'zod/v4';

export const MonitorObject = {
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  url: z.string().trim().url('Must be a valid URL'),
  interval: z.enum([`${HourlyPlan.HOURLY}`, `${HourlyPlan.QUARTERLY}`, `${HourlyPlan.HALF_DAY}`, `${HourlyPlan.DAILY}`]).transform(Number),
};

export const MonitorSchema = z.object(MonitorObject);

export type MonitorForm = z.infer<typeof MonitorSchema>;
