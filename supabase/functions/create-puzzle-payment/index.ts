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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { puzzleImageId, difficulty, pieceCount } = await req.json();
    
    if (!puzzleImageId || !difficulty || !pieceCount) {
      throw new Error("Missing required parameters: puzzleImageId, difficulty, pieceCount");
    }

    // Get pricing for this puzzle configuration
    const { data: pricing, error: pricingError } = await supabaseClient
      .from('puzzle_game_pricing')
      .select('*')
      .eq('difficulty_level', difficulty)
      .eq('piece_count', pieceCount)
      .eq('is_active', true)
      .single();

    if (pricingError || !pricing) {
      throw new Error("Pricing not found for this puzzle configuration");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create a new customer if one doesn't exist
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Create a one-time payment session for the puzzle game
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: pricing.currency.toLowerCase(),
            product_data: {
              name: `Puzzle Game - ${difficulty} (${pieceCount} pieces)`,
              description: `Access to puzzle game with ${pieceCount} pieces`,
            },
            unit_amount: Math.round(pricing.base_price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/puzzle-payment-success?session_id={CHECKOUT_SESSION_ID}&puzzle_id=${puzzleImageId}`,
      cancel_url: `${req.headers.get("origin")}/puzzle-payment-canceled`,
      metadata: {
        user_id: user.id,
        puzzle_image_id: puzzleImageId,
        difficulty: difficulty,
        piece_count: pieceCount.toString(),
        payment_type: 'puzzle_game'
      },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating puzzle payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});