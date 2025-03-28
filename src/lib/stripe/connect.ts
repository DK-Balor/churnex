import { supabase } from '../supabase';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function connectStripeAccount() {
  try {
    // Generate OAuth link for connecting existing Stripe account
    const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${window.location.origin}/stripe/callback`;

    return { url: stripeUrl };
  } catch (error) {
    console.error('Error generating Stripe OAuth URL:', error);
    throw error;
  }
}

export async function handleStripeOAuthCallback(code: string) {
  try {
    // Exchange the authorization code for an access token
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    // Get the connected account ID
    const connectedAccountId = response.stripe_user_id;

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Store the connection in your database
    const { error: dbError } = await supabase
      .from('stripe_accounts')
      .upsert({
        user_id: user.id,
        stripe_account_id: connectedAccountId,
        connected: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (dbError) throw dbError;

    return { success: true };
  } catch (error) {
    console.error('Error handling Stripe OAuth callback:', error);
    throw error;
  }
} 