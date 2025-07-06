import EnterprisePlanCard from '@/components/client/common/enterprise-plan.card';
import InfoTestCard from '@/components/client/common/info-test-card';
import ProPlanCard from '@/components/client/common/pro-plan.card';
import SubscriptionModel from '@/db/model/subscription.model';
import { SubscriptionPlan, TotalPlan } from '@/enum/app.enum';
import { getAuthSession } from '@/lib/auth.lib';
import Image from 'next/image';

export default async function PricingPage() {
  const authUser = await getAuthSession();
  let plan: SubscriptionPlan | null = null;
  const features: string[] = [
    `✔ Up to ${TotalPlan.ENTERPRISE} active monitors`,
    '✔ 12 to 24-hour check interval only',
    '✔ Automatic AI analysis on initial job setup',
  ];

  if (authUser.session) {
    const subscription = new SubscriptionModel();
    plan = await subscription.getPlan(authUser.user!.id);
  }

  return (
    <div className="max-w-[1000px] mx-auto w-full mt-5 space-y-16 text-center">
      <div className="space-y-3">
        <h1 className="uppercase font-anton text-3xl">Choose your Plan</h1>
        <p>Pick a plan tailored to your needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 items-center text-left">
        <div className="border border-purple-300 rounded-md p-6 min-h-fit h-[680px] bg-purple-50 min space-y-6 flex text-purple-500 flex-col items-center duration-300 hover:scale-[1.05]">
          <p className="text-2xl font-bold">Free</p>

          <Image src="/illustration/free.svg" alt="free plan" height={100} width={100} />

          <strong className="text-2xl flex items-center gap-2">FREE</strong>
          <hr className="block w-full border-b-rose-50 opacity-25 mb-5" />
          <ul className="flex flex-col items-start gap-4">
            {features.map((feature, index) => (
              <li key={index}>
                <p className="text-lg">{feature} </p>
              </li>
            ))}
          </ul>
        </div>
        <ProPlanCard isAuthenticated={Boolean(authUser?.session)} plan={plan} />
        <EnterprisePlanCard isAuthenticated={Boolean(authUser?.session)} plan={plan} />
      </div>
      <InfoTestCard />
    </div>
  );
}
