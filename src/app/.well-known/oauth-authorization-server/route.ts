import { oAuthDiscoveryMetadata } from 'better-auth/plugins';
import { auth } from '../../../lib/auth.lib';

export const GET = oAuthDiscoveryMetadata(auth);
