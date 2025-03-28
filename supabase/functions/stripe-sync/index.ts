import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "jsr:@stripe/stripe-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user's Stripe account ID
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("stripe_account_id")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!userData.stripe_account_id) {
      throw new Error("No Stripe account connected");
    }

    // Get Stripe account data
    const account = await stripe.accounts.retrieve(userData.stripe_account_id);
    const charges = await stripe.charges.list({
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // Last 30 days
      },
    });
    const payouts = await stripe.payouts.list({
      limit: 100,
    });

    // Calculate metrics
    const totalRevenue = charges.data
      .filter((charge) => charge.status === "succeeded")
      .reduce((sum, charge) => sum + charge.amount, 0);
    const pendingPayouts = payouts.data
      .filter((payout) => payout.status === "pending")
      .reduce((sum, payout) => sum + payout.amount, 0);

    // Update user's metrics
    const { error: updateError } = await supabaseClient
      .from("users")
      .update({
        stripe_metrics: {
          total_revenue: totalRevenue,
          pending_payouts: pendingPayouts,
          last_sync: new Date().toISOString(),
        },
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        metrics: {
          totalRevenue,
          pendingPayouts,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}); 