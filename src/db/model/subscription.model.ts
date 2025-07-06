import DB from '../abstract.db';
import { subscription as subscriptionSchema } from '../schema';
import { and, eq } from 'drizzle-orm';
import { HourlyPlan, SubscriptionPlan, TotalPlan } from '@/enum/app.enum';
import { BadRequestError } from '@/errors/bad-request.error';
import MonitorModel from './monitor.model';
import { ADMIN_EMAIL } from '@/config/env.config';
import { getAuthenticatedSession } from '@/lib/auth.lib';

// type Subscription = Omit<NewSubscription, 'id' | 'plan'>;

export default class SubscriptionModel extends DB {
  async new(userId: string) {
    await this.checkUserExists(userId);

    const result = await this.db
      .insert(subscriptionSchema)
      .values({
        userId: userId,
        plan: SubscriptionPlan.FREE,
        stripeId: null,
      })
      .returning({ insertedId: subscriptionSchema.id });

    const { insertedId } = result[0];

    const addedItem = await this.db.query.monitorLog.findFirst({
      where: eq(subscriptionSchema.id, insertedId),
    });

    return addedItem;
  }

  async getPlan(userId: string) {
    const subscription = await this.db.query.subscription.findFirst({
      where: eq(subscriptionSchema.userId, userId),
    });

    if (!subscription) throw new BadRequestError('Subscription not found');

    return subscription.plan;
  }

  async updatePlan(userId: string, stripeId: string, plan: SubscriptionPlan) {
    const user = await this.db.query.subscription.findFirst({
      where: eq(subscriptionSchema.userId, userId),
    });

    if (!user) throw new BadRequestError('User not exists');

    await this.db
      .update(subscriptionSchema)
      .set({
        plan,
        stripeId,
        updatedAt: new Date(),
      })
      .where(eq(subscriptionSchema.userId, userId));
  }

  private async checkUserExists(userId: string) {
    const user = await this.db.query.subscription.findFirst({
      where: eq(subscriptionSchema.userId, userId),
    });

    if (user) throw new BadRequestError('User already has a subscription');
  }

  async validateStripeById(userId: string, id: string) {
    const subscription = await this.db.query.subscription.findFirst({
      where: and(eq(subscriptionSchema.stripeId, id), eq(subscriptionSchema.userId, userId)),
    });

    if (!subscription) return;

    if (subscription.stripeId) throw new BadRequestError('Already been paid!');
  }

  async validatePlan(userId: string, interval: number) {
    const monitor = new MonitorModel();
    const subscription = new SubscriptionModel();
    const { user } = await getAuthenticatedSession();

    const plan = await subscription.getPlan(userId);
    const total = await monitor.getTotalByUser(userId);

    if (ADMIN_EMAIL === user.email) return; //escape validation

    const freePlan = plan === SubscriptionPlan.FREE && total >= TotalPlan.FREE;
    const proPlan = plan === SubscriptionPlan.PRO && total >= TotalPlan.PRO;
    const enterprisePlan = plan === SubscriptionPlan.ENTERPRISE && total >= TotalPlan.ENTERPRISE;

    const freePlanInterval =
      plan === SubscriptionPlan.FREE && ![HourlyPlan.HALF_DAY, HourlyPlan.DAILY].includes(interval);

    const proPlanInterval =
      plan === SubscriptionPlan.PRO &&
      ![HourlyPlan.QUARTERLY, HourlyPlan.HALF_DAY, HourlyPlan.DAILY].includes(interval);

    if (freePlan) {
      throw new BadRequestError(`Free plan allows only ${TotalPlan.FREE} monitors`);
    }

    if (proPlan) {
      throw new BadRequestError(`Free plan allows only ${TotalPlan.PRO} monitors`);
    }

    if (enterprisePlan) {
      throw new BadRequestError(
        'You have reached the maximum number of monitors allowed for your Enterprise plan',
      );
    }

    if (freePlanInterval) {
      throw new BadRequestError('Free plan allows only 12 to 24 hours interval for monitoring');
    }

    if (proPlanInterval) {
      throw new BadRequestError('Free plan allows only 6, 12 to 24 hours interval for monitoring');
    }
  }
}
