'use client';

import { SubscriptionPlan } from '@/enum/app.enum';

interface PlanStatusProps {
  plan: SubscriptionPlan;
  className?: string;
}

export default function PlanStatus({ plan, className }: PlanStatusProps) {
  const color = {
    free: 'text-purple-500',
    pro: 'text-rose-500',
    enterprise: 'text-cyan-500',
  };

  return (
    <div className={`items-center flex ${className || ''}`}>
      <p>Plan:</p>
      <strong className={`font-open-sauce uppercase text-xl md:mx-1 ${color[plan]}`}>{plan}</strong>
    </div>
  );
}
