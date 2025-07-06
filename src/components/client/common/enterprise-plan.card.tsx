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

export default function EnterprisePlanCard({ plan, isAuthenticated }: EnterprisePlanCardProps) {
  const [loadingEnt, setEntLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const features: string[] = [
    `✔ Up to ${TotalPlan.ENTERPRISE} active monitors`,
    '✔ All interval options',
    '✔ Automatic AI analysis on initial job setup',
    '✔ AI re-analysis on monitor status change',
    '✔ Weekly AI performance summary and insights',
  ];

  const handleEnterpriseCheckout = async () => {
    try {
      setEntLoading(true);
      const res = await axios.post('/api/v1/checkout-session', {
        plan: SubscriptionPlan.ENTERPRISE,
      });
      const { id: sessionId } = res.data;
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      messageApi.error(err.response.data?.errors[0].message || err.response.data);
    } finally {
      setEntLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="border border-gray-300 rounded-md bg-cyan-50 min-h-fit h-[680px] space-y-6 text-cyan-500 duration-300 hover:scale-[1.05] p-6 flex flex-col items-center">
        <p className="text-2xl font-bold">Enterprise</p>
        <Image src="/illustration/enterprise.svg" alt="enterprise plan" height={100} width={100} />

        <strong className="text-3xl flex items-center">
          <span className="text-4xl">₱</span>2,500
        </strong>
        <hr className="border-b-cyan-50 block w-full opacity-25 mb-5" />

        <ul className="flex flex-col items-start gap-4">
          {features.map((feature, index) => (
            <li key={index}>
              <p className="text-lg">{feature}</p>
            </li>
          ))}
        </ul>

        {isAuthenticated ? (
          <ButtonUI
            onClick={handleEnterpriseCheckout}
            disabled={loadingEnt || plan === SubscriptionPlan.ENTERPRISE}
            className="px-16! text-2xl! py-5! mt-auto bg-cyan-500! w-full"
            text={
              loadingEnt
                ? 'Checking out...'
                : plan === SubscriptionPlan.ENTERPRISE
                  ? 'PURCHASED'
                  : 'CHOOSE'
            }
          />
        ) : null}
      </div>
    </>
  );
}
