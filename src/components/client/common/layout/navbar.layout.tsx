'use server';

import { Button, Menu, MenuProps, Space } from 'antd';

import { MenuOutlined } from '@ant-design/icons';
import Link from 'next/link';
import LoginButton from '../button/login.button';
import { APP_NAME } from '@/config/env.config';
import { getAuthSession } from '@/lib/auth.lib';
import SubscriptionModel from '@/db/model/subscription.model';
import { SubscriptionPlan } from '@/enum/app.enum';
import LogoutButton from '../button/logout.button';
import LogoIcon from '@/components/icons/logo.icon';
import PlanStatus from '../plan-status';

type MenuItem = Required<MenuProps>['items'][number];

export default async function NavBarLayout() {
  const session = await getAuthSession();
  const subscription = new SubscriptionModel();
  const userId = session.user?.id;
  let plan: SubscriptionPlan | null = null;

  if (userId) {
    const getPlan = await subscription.getPlan(userId);
    plan = getPlan;
  }

  const menuItems: MenuItem[] = [
    {
      label: <Link href="/">Home</Link>,
      key: 'home',
    },
  ];

  if (userId) {
    menuItems.push({
      label: <Link href="/dashboard">Dashboard</Link>,
      key: 'dashboard',
    });
  }

  menuItems.push({
    label: <SubscriptionLink />,
    key: 'pricing',
  });

  return (
    <nav className="border-b border-b-gray-300 relative mb-10">
      <div className="items-center flex justify-between mx-auto max-w-[2400px]">
        <div className="items-center flex gap-4 w-full">
          <div className="h-full static order-2 md:order-0 flex md:w-[600px] lg:w-[350px] gap-2 items-center">
            <Link href="/">
              <LogoIcon />
            </Link>
            <strong className="hidden md:block font-open-sauce">{APP_NAME}</strong>
          </div>
          <Menu
            className={`bg-transparent border-b-0! text-base! leading-16 md:leading-14 md:ml-0 md:w-[inherit]! -ml-[16px]! w-[48px]!`}
            mode="horizontal"
            items={menuItems}
            overflowedIndicator={<Button type="text" icon={<MenuOutlined />}></Button>}
          />
          <Space size="large" className="order-2 flex ml-auto">
            {session.session ? (
              <>
                <PlanStatus className="hidden md:flex" plan={plan as SubscriptionPlan} />
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </Space>
        </div>
      </div>
    </nav>
  );
}

const SubscriptionLink = () => {
  return (
    <Link href="/pricing" className="transition-colors hover:text-[#597EF7] duration-300">
      Pricing
    </Link>
  );
};
