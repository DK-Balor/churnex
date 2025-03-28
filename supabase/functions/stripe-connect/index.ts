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

    // Get user data
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // Create Stripe account
    const account = await stripe.accounts.create({
      type: "standard",
      email: userData.email,
      business_profile: {
        name: userData.organization_name || "My Business",
      },
    });

    // Create account link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${Deno.env.get("FRONTEND_URL")}/settings/billing?refresh=true`,
      return_url: `${Deno.env.get("FRONTEND_URL")}/settings/billing?success=true`,
      type: "account_onboarding",
    });

    // Update user with Stripe account ID
    const { error: updateError } = await supabaseClient
      .from("users")
      .update({ stripe_account_id: account.id })
      .eq("id", userId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ url: accountLink.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}); 