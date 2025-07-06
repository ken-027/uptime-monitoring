'use client';
import { authClient } from '@/lib/auth-client.lib';

export default function StartedButton() {
  const onLogin = () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  };

  return (
    <button
      onClick={onLogin}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer focus:outline-none"
    >
      Get Started Free
    </button>
  );
}
