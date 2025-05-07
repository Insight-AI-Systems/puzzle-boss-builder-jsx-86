
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCorsOptions } from "../_shared/cors.ts";
import { successResponse, errorResponse } from "../_shared/response.ts";
import { verifyAuth, AuthUser } from "../_shared/auth.ts";
import { EdgeFunctionLogger } from "../_shared/logging.ts";
import { getEnvVariable, getSupabaseConfig } from "../_shared/config.ts";

// Initialize logger
const logger = new EdgeFunctionLogger("check-subscription");

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end?: string | null;
  credits: number;
}

// Get free subscription info when Stripe is not configured
function getFreeSubscriptionInfo(): SubscriptionInfo {
  return {
    subscribed: false,
    subscription_tier: "Free",
    credits: 10
  };
}

// Update subscriber record in database
async function updateSubscriberRecord(
  supabase: any,
  userId: string,
  email: string,
  subscriptionInfo: SubscriptionInfo,
  stripeCustomerId?: string
): Promise<void> {
  try {
    await supabase.from("subscribers").upsert({
      user_id: userId,
      email: email,
      stripe_customer_id: stripeCustomerId,
      subscribed: subscriptionInfo.subscribed,
      subscription_tier: subscriptionInfo.subscription_tier,
      credits: subscriptionInfo.credits,
      subscription_end: subscriptionInfo.subscription_end,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

    logger.info("Subscriber record updated", { userId, tier: subscriptionInfo.subscription_tier });
  } catch (error) {
    logger.error("Error updating subscriber record", { error, userId });
    throw error;
  }
}

// Get subscription info from Stripe
async function getStripeSubscriptionInfo(
  stripe: Stripe,
  customer: Stripe.Customer
): Promise<SubscriptionInfo> {
  try {
    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
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

      logger.info("Active subscription found", { 
        subscriptionTier, 
        credits,
        subscriptionEnd,
        productName: product.name 
      });
    }
    
    return {
      subscribed: hasActiveSubscription,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      credits: credits
    };
  } catch (error) {
    logger.error("Error getting subscription info from Stripe", { error, customerId: customer.id });
    throw error;
  }
}

async function handleCheckSubscription(user: AuthUser): Promise<Response> {
  if (!user?.email) {
    return errorResponse("User not authenticated or email not available", "unauthorized", 401);
  }

  logger.info("Checking subscription for user", { userId: user.id, email: user.email });

  // Create Supabase admin client for bypassing RLS
  const config = getSupabaseConfig();
  const supabaseAdmin = createClient(
    config.url,
    config.serviceRoleKey,
    { auth: { persistSession: false } }
  );

  // Check if Stripe is configured
  let stripeKey: string;
  try {
    stripeKey = getEnvVariable("STRIPE_SECRET_KEY", false);
    if (!stripeKey) {
      logger.info("Stripe is not configured, returning default subscription info");
      
      const freeSubscription = getFreeSubscriptionInfo();
      await updateSubscriberRecord(supabaseAdmin, user.id, user.email, freeSubscription);
      
      return successResponse(freeSubscription);
    }
  } catch (error) {
    logger.error("Error checking Stripe configuration", { error });
    return errorResponse("Server configuration error", "config_error", 500);
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      // No customer record, return free subscription info
      logger.info("No Stripe customer found for user", { userId: user.id, email: user.email });
      
      const freeSubscription = getFreeSubscriptionInfo();
      await updateSubscriberRecord(supabaseAdmin, user.id, user.email, freeSubscription);
      
      return successResponse(freeSubscription);
    }

    // Get subscription info from Stripe
    const customer = customers.data[0];
    const subscriptionInfo = await getStripeSubscriptionInfo(stripe, customer);
    
    // Update subscriber record
    await updateSubscriberRecord(
      supabaseAdmin,
      user.id,
      user.email,
      subscriptionInfo,
      customer.id
    );
    
    return successResponse(subscriptionInfo);
  } catch (error) {
    logger.error("Error checking subscription", { error, userId: user.id });
    
    // Return default values if processing fails, to avoid blocking the UI
    return successResponse(getFreeSubscriptionInfo());
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsOptions(req);
  if (corsResponse) return corsResponse;

  try {
    // Verify authentication
    const { user, error } = await verifyAuth(req);
    if (error) return error;
    if (!user) {
      return errorResponse("Authentication required", "unauthorized", 401);
    }

    // Process subscription check
    return await handleCheckSubscription(user);
  } catch (error) {
    logger.error("Unexpected error in check-subscription", { error });
    return errorResponse(error.message || "An unexpected error occurred", "server_error", 500);
  }
});
