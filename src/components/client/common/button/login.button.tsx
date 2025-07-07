'use client';

import { authClient } from '@/lib/auth-client.lib';
import ButtonCommon from '../../ui/button.ui';
import { GoogleOutlined } from '@ant-design/icons';

export default function LoginButton() {
  const onLogin = () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  };

  return <ButtonCommon icon={<GoogleOutlined />} text="Sign in with Google" onClick={onLogin} />;
}
