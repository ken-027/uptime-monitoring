import { betterAuth, Session } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { mcp } from 'better-auth/plugins';
import db from '../config/db-connection.config';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config/env.config';
import { headers } from 'next/headers';
import { User } from '@/types/model';
import { UnAuthorizedError } from '@/errors/unauthorized.error';
import SubscriptionModel from '@/db/model/subscription.model';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  plugins: [mcp({ loginPage: '/' })],
  logger: {
    level: 'debug', // or "verbose"
    disabled: false,
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const subscriptionModel = new SubscriptionModel();
          await subscriptionModel.new(user.id);
        },
      },
    },
  },
});

export const getAuthSession = async (): Promise<{ session?: Session; user?: User }> => {
  const authUser = await auth.api.getSession({ headers: await headers() });

  return {
    user: authUser?.user
      ? {
          ...authUser.user,
          image: authUser.user.image ?? null,
        }
      : undefined,
    session: authUser?.session,
  };
};

export const getAuthenticatedSession = async (): Promise<{ session: Session; user: User }> => {
  const authUser = await auth.api.getSession({ headers: await headers() });

  if (!authUser?.session) throw new UnAuthorizedError('Unauthorized access');

  return {
    user: authUser.user as User,
    session: authUser.session,
  };
};
