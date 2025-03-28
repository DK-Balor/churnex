import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, timeRange } = await req.json();
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

    // Get customer data
    const { data: customers, error: customersError } = await supabaseClient
      .from("customers")
      .select("*")
      .eq("user_id", userId);

    if (customersError) throw customersError;

    // Calculate metrics
    const activeCustomers = customers.filter((c) => c.status === "active").length;
    const atRiskCustomers = customers.filter((c) => c.status === "at_risk").length;
    const churnedCustomers = customers.filter((c) => c.status === "churned").length;

    // Get revenue data from Stripe metrics
    const stripeMetrics = userData.stripe_metrics || {
      total_revenue: 0,
      pending_payouts: 0,
    };

    // Calculate churn rate
    const churnRate = churnedCustomers / (activeCustomers + churnedCustomers) || 0;

    // Calculate revenue at risk
    const revenueAtRisk = atRiskCustomers * (stripeMetrics.total_revenue / activeCustomers);

    return new Response(
      JSON.stringify({
        revenue: {
          total: stripeMetrics.total_revenue,
          growth: 0, // This would need historical data to calculate
          previousPeriod: 0, // This would need historical data to calculate
        },
        customers: {
          total: customers.length,
          active: activeCustomers,
          atRisk: atRiskCustomers,
          churned: churnedCustomers,
        },
        churnRate,
        revenueAtRisk,
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