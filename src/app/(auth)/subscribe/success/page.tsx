import RedirectOnSuccess from '@/components/client/common/redirect-on-success';
import SubscriptionModel from '@/db/model/subscription.model';
import { SubscriptionPlan } from '@/enum/app.enum';
import { BadRequestError } from '@/errors/bad-request.error';
import { getAuthenticatedSession } from '@/lib/auth.lib';
import { stripe } from '@/lib/stripe.lib';

interface ServerComponents {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: ServerComponents) {
  try {
    const params = await searchParams;
    const sessionId = params.session_id as string;
    const plan = params.plan as string;

    const { user: authUser } = await getAuthenticatedSession();

    const retrieveSession = await stripe.checkout.sessions.retrieve(sessionId.trim());

    if (retrieveSession.payment_status !== 'paid' || retrieveSession.status !== 'complete')
      throw new BadRequestError('Payment is not successful');

    const subscription = new SubscriptionModel();

    await subscription.validateStripeById(authUser.id, retrieveSession.id);
    await subscription.updatePlan(authUser.id, retrieveSession.id, SubscriptionPlan[plan as never]);

    return (
      <div className="mx-auto w-fit  flex flex-col items-center space-y-2">
        <h1>💳 Payment successful. Thank you!</h1>
        <RedirectOnSuccess />
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return <h1 className="text-center">{err.message}</h1>;
  }
}
