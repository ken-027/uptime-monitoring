'use server';

import MonitorModel from '@/db/model/monitor.model';
import SubscriptionModel from '@/db/model/subscription.model';
import { BadRequestError } from '@/errors/bad-request.error';
import { getAuthenticatedSession } from '@/lib/auth.lib';
import CronJob from '@/lib/cron-job.lib';
import { MonitorForm, MonitorSchema } from '@/validation/app.validation';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod/v4';

export type AddMonitorState = {
  form?: Partial<MonitorForm>;
  errors?: Partial<Record<keyof MonitorForm | 'custom', string[]>>;
  success?: boolean;
};

export const deleteItem = async (id: string) => {
  const monitor = new MonitorModel();
  const cronJob = new CronJob(id);

  await monitor.deleteItem(id);
  await cronJob.remove();

  revalidatePath('/dashboard');
};

export const pauseItem = async (id: string) => {
  const cronJob = new CronJob(id);

  await cronJob.pause();

  revalidatePath('/dashboard');
};

export const resumeItem = async (id: string) => {
  const cronJob = new CronJob(id);

  await cronJob.resume();

  revalidatePath('/dashboard');
};

export const addItem = async (
  _prev: AddMonitorState | null,
  formData: FormData,
): Promise<AddMonitorState> => {
  const fields = Object.fromEntries(formData.entries());

  try {
    const { name, interval, url } = MonitorSchema.parse(fields);
    const { user: authUser } = await getAuthenticatedSession();

    const monitor = new MonitorModel();
    const subscription = new SubscriptionModel();

    await subscription.validatePlan(authUser.id, interval);

    await monitor.checkUrl(url, authUser.id);
    const addedMonitor = await monitor.add({
      name,
      url,
      interval,
      userId: authUser.id,
    });

    const cronJob = new CronJob(addedMonitor.id);
    await cronJob.addToCron();

    revalidatePath('/dashboard');

    return {
      form: {
        name: '',
        url: '',
        interval: 2,
      },
      success: true,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        form: fields,
        errors: {
          ...err.flatten().fieldErrors,
        },
      };
    } else if (err instanceof BadRequestError) {
      return {
        form: fields,
        errors: {
          custom: [err.message],
        },
      };
    }

    return {
      form: fields,
      errors: {},
    };
  }
};
