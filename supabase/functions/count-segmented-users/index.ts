
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin API key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Extract auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user is authenticated and an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin or super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || !["admin", "super_admin"].includes(profile.role)) {
      console.error("Permissions error:", profileError || "Not an admin");
      return new Response(
        JSON.stringify({ error: "Unauthorized - not an admin" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the request body containing filter criteria
    const { 
      countryFilter, 
      ageFilter, 
      genderFilter, 
      categoryFilter, 
      prizeFilter 
    } = await req.json();

    // Start building the query
    let query = supabaseAdmin.from("profiles").select("id", { count: "exact" });

    // Apply country filter
    if (countryFilter && countryFilter !== "all") {
      query = query.eq("country", countryFilter);
    }

    // Apply gender filter
    if (genderFilter && genderFilter.length > 0 && genderFilter.length < 4) {
      // If not all genders are selected
      query = query.in("gender", genderFilter);
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      query = query.contains("categories_played", [categoryFilter]);
    }
    
    // Age filter would typically use a range query if the database stored age directly
    // But since we might store age groups or birth dates, this would need to be adapted
    
    // Prize filter
    if (prizeFilter && prizeFilter !== "all") {
      // For prize winners, we would join with the prize_winners table
      if (prizeFilter === "winners") {
        const { data: winnerIds } = await supabaseAdmin
          .from("prize_winners")
          .select("user_id");
        
        if (winnerIds && winnerIds.length > 0) {
          const ids = winnerIds.map(w => w.user_id);
          query = query.in("id", ids);
        } else {
          // No prize winners, return 0
          return new Response(
            JSON.stringify({ count: 0 }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } else if (prizeFilter === "non_winners") {
        const { data: winnerIds } = await supabaseAdmin
          .from("prize_winners")
          .select("user_id");
        
        if (winnerIds && winnerIds.length > 0) {
          const ids = winnerIds.map(w => w.user_id);
          query = query.not("id", "in", `(${ids.join(',')})`);
        }
      }
    }
    
    // Execute the query
    const { count, error } = await query;
    
    if (error) {
      throw error;
    }

    // Return the count
    return new Response(
      JSON.stringify({ count: count || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error counting segmented users:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred counting users", count: 0 }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
