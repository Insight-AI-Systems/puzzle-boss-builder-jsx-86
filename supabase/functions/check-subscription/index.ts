
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client with service role key to bypass RLS
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    // Use anon key client for auth verification
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Check if STRIPE_SECRET_KEY is configured
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.log("Stripe is not configured. Returning default subscription info.");
      
      // Update subscriber status to free plan
      await supabaseAdmin.from("subscribers").upsert({
        user_id: user.id,
        email: user.email,
        subscribed: false,
        subscription_tier: "Free",
        credits: 10,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_tier: "Free",
        credits: 10
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    // If Stripe is configured, proceed with subscription check
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    try {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      
      if (customers.data.length === 0) {
        // No customer record, update subscriber status to false
        await supabaseAdmin.from("subscribers").upsert({
          user_id: user.id,
          email: user.email,
          subscribed: false,
          subscription_tier: "Free",
          credits: 10,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
        
        return new Response(JSON.stringify({
          subscribed: false,
          subscription_tier: "Free",
          credits: 10
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      const customerId = customers.data[0].id;
      
      // Check for active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      
      const hasActiveSubscription = subscriptions.data.length > 0;
      let subscriptionTier = "Free";
      let credits = 10;
      let subscriptionEnd = null;
      
      if (hasActiveSubscription) {
        const subscription = subscriptions.data[0];
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        
        // Get product information to determine tier
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const productId = price.product as string;
        const product = await stripe.products.retrieve(productId);
        
        // Determine subscription tier and credits from product metadata or name
        if (product.name.toLowerCase().includes("premium")) {
          subscriptionTier = "Premium";
          credits = 50;
        } else if (product.name.toLowerCase().includes("elite")) {
          subscriptionTier = "Elite";
          credits = 100;
        }
      }
      
      // Update subscriber record in database
      await supabaseAdmin.from("subscribers").upsert({
        user_id: user.id,
        email: user.email,
        stripe_customer_id: customerId,
        subscribed: hasActiveSubscription,
        subscription_tier: subscriptionTier,
        credits: credits,
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      
      return new Response(JSON.stringify({
        subscribed: hasActiveSubscription,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        credits: credits
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError) {
      console.error("Stripe API error:", stripeError);
      // Return default values if Stripe API fails
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_tier: "Free",
        credits: 10
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Changed to 200 to avoid blocking the UI
    });
  }
});
