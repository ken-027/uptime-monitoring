import { SubscriptionPlan, SubscriptionPrice } from '@/enum/app.enum';
import { withErrorWrapper } from '@/errors/error-wrapper.error';
import { UnAuthorizedError } from '@/errors/unauthorized.error';
import { getAuthSession } from '@/lib/auth.lib';
import { stripe } from '@/lib/stripe.lib';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod/v4';

const SubscriptionPlanSchema = z.object({
  plan: z.enum([SubscriptionPlan.PRO, SubscriptionPlan.ENTERPRISE]),
});

export const POST = withErrorWrapper(async (request: NextRequest) => {
  const session = await getAuthSession();

  if (!session.user) throw new UnAuthorizedError('unauthorized access');

  const requestBody = await request.json();

  const validated = SubscriptionPlanSchema.parse(requestBody);
  const productName = `Uptime Monitoring ${validated.plan === SubscriptionPlan.ENTERPRISE ? 'Enterprise' : 'Pro'} Plan`;
  const plan = validated.plan.toUpperCase();

  // @ts-expect-error @ts
  const price = SubscriptionPrice[plan] as number;

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'php',
          product_data: { name: productName },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${request.headers.get('origin')}/subscribe/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
    cancel_url: `${request.headers.get('origin')}/subscribe/cancel`,
  });

  return NextResponse.json({ id: stripeSession.id }, { status: 200 });
});

export const config = {
  api: {
    bodyParser: false,
  },
};
