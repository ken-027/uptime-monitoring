'use client';

import { SubscriptionPlan, TotalPlan } from '@/enum/app.enum';
import { getStripe } from '@/lib/stripe-client.lib';
import { message } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import ButtonUI from '../ui/button.ui';
import axios from 'axios';

interface EnterprisePlanCardProps {
  plan: SubscriptionPlan | null;
  isAuthenticated: boolean;
}

export default function ProPlanCard({ plan, isAuthenticated }: EnterprisePlanCardProps) {
  const [loadingPro, setProLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const features: string[] = [
    `✔ Up to ${TotalPlan.ENTERPRISE} active monitors`,
    '✔ 6, 12 to 24-hour check interval only',
    '✔ Automatic AI analysis on initial job setup',
    '✔ AI re-analysis on monitor status change',
  ];

  const handleProCheckout = async () => {
    if (!isAuthenticated) return;

    try {
      setProLoading(true);
      const res = await axios.post('/api/v1/checkout-session', {
        plan: SubscriptionPlan.PRO,
      });
      const { id: sessionId } = res.data;
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      messageApi.error(err.response.data?.errors[0].message || err.response.data);
    } finally {
      setProLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="border border-rose-300 bg-rose-50 rounded-md space-y-6 min-h-fit h-[720px] text-rose-500 duration-300 hover:scale-[1.05] p-6 mb-4 flex flex-col items-center">
        <p className="text-2xl font-bold">Pro</p>
        <Image src="/illustration/pro.svg" alt="pro plan" height={100} width={100} />

        <strong className="text-3xl flex items-center">
          <span className="text-4xl">₱</span>1,000
        </strong>
        <hr className="border-b-rose-50 opacity-25 block w-full mb-5" />

        <ul className="flex flex-col items-start gap-4">
          {features.map((feature, index) => (
            <li key={index}>
              <p className="text-lg">{feature}</p>
            </li>
          ))}
        </ul>

        {isAuthenticated ? (
          <ButtonUI
            onClick={handleProCheckout}
            disabled={loadingPro || plan !== SubscriptionPlan.FREE}
            className="px-16! text-2xl! py-5! bg-rose-500! mt-auto w-full"
            text={
              loadingPro
                ? 'Checking out...'
                : plan === SubscriptionPlan.PRO
                  ? 'PURCHASED'
                  : 'CHOOSE'
            }
          />
        ) : null}
      </div>
    </>
  );
}
