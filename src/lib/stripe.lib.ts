import { STRIPE_SECRET_KEY } from '@/config/env.config';
import Stripe from 'stripe';

export const stripe = new Stripe(STRIPE_SECRET_KEY || 'stripe is required', {
  apiVersion: '2025-06-30.basil',
});
