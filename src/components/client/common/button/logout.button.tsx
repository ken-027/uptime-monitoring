'use client';

import { authClient } from '@/lib/auth-client.lib';
import ButtonUI from '../../ui/button.ui';
import { logoutAction } from '@/app/actions/auth.action';
import { usePathname } from 'next/navigation';

import { LogoutOutlined } from '@ant-design/icons';
import { useTransition } from 'react';

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();
  const pathName = usePathname();

  const bindLogoutAction = logoutAction.bind(null, pathName);

  const onLogout = () => {
    startTransition(async () => {
      await authClient.signOut();
      await bindLogoutAction();
    });
  };

  return (
    <ButtonUI
      color="danger"
      icon={<LogoutOutlined />}
      disabled={pending}
      text="Logout"
      className="text-base!"
      onClick={onLogout}
    />
  );
}
