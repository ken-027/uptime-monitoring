import PlanStatus from '@/components/client/common/plan-status';
import '../globals.css';
import { auth } from '@/lib/auth.lib';
import { Space } from 'antd';
import { headers } from 'next/headers';
import Image from 'next/image';
import { SubscriptionPlan } from '@/enum/app.enum';
import SubscriptionModel from '@/db/model/subscription.model';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  let plan: SubscriptionPlan | null = null;

  if (session?.session) {
    const subscription = new SubscriptionModel();

    const getPlan = await subscription.getPlan(session.user.id);
    plan = getPlan;
  }

  return session ? (
    <Space direction="vertical" className="w-full" size="large">
      <PlanStatus className="flex gap-2 md:hidden" plan={plan as SubscriptionPlan} />
      <div className="flex gap-4">
        <Image
          alt={`${session.user!.name} profile`}
          src={session.user!.image || '/images/vercel.svg'}
          className="rounded-full"
          height={50}
          width={50}
        />
        <div className="">
          <p>{session.user!.name}</p>
          <p>{session.user!.email}</p>
        </div>
      </div>
      {children}
    </Space>
  ) : (
    <h1>Need to be login</h1>
  );
}
