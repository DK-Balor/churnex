import { supabase } from '../supabase';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export async function connectStripeAccount() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: existingAccount } = await supabase
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingAccount) {
      return { success: true, message: 'Stripe account already connected' };
    }

    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'US',
      email: user.email,
      business_profile: {
        name: 'Your Business Name',
        support_email: user.email,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const { error } = await supabase
      .from('stripe_accounts')
      .insert([
        {
          user_id: user.id,
          stripe_account_id: account.id,
          status: account.details_submitted ? 'active' : 'pending',
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    return {
      success: true,
      accountId: account.id,
      onboardingUrl: account.details_submitted ? null : account.charges_enabled ? 
        await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${window.location.origin}/dashboard/settings/billing`,
          return_url: `${window.location.origin}/dashboard/settings/billing`,
          type: 'account_onboarding',
        }).then(link => link.url) : null,
    };
  } catch (error) {
    console.error('Error connecting Stripe account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect Stripe account',
    };
  }
}

export async function handleStripeOAuthCallback(code: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    const connectedAccountId = response.stripe_user_id;
    if (!connectedAccountId) throw new Error('No connected account ID received');

    const { error } = await supabase
      .from('stripe_accounts')
      .upsert([
        {
          user_id: user.id,
          stripe_account_id: connectedAccountId,
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error handling Stripe OAuth callback:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete Stripe connection',
    };
  }
} 