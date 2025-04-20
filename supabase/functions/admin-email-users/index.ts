
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  userIds: string[];
  subject: string;
  body: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify that the request is from an admin user
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Check if the user is an admin
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profileData || !['super_admin', 'admin'].includes(profileData.role)) {
      return new Response(
        JSON.stringify({ error: 'Only admins can send bulk emails' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Parse request body
    const { userIds, subject, body }: EmailRequest = await req.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No user IDs provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    if (!subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Subject and body are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Get user emails from IDs
    const { data: users, error: usersError } = await supabase.auth.admin
      .listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return new Response(
        JSON.stringify({ error: 'Error fetching user data' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Filter users by the provided userIds
    const targetUsers = users?.users?.filter(u => userIds.includes(u.id)) || [];
    
    if (targetUsers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No matching users found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // In a real implementation, you would integrate with an email service
    // For demonstration, we're just logging the email details
    console.log(`
      Would send email to ${targetUsers.length} users:
      Subject: ${subject}
      Body: ${body}
      Recipients: ${targetUsers.map(u => u.email).join(', ')}
    `);
    
    // Record the email sending in a table (if you had one)
    // const { data: emailLog, error: logError } = await supabase
    //   .from('email_logs')
    //   .insert({
    //     sent_by: user.id,
    //     user_count: targetUsers.length,
    //     subject,
    //     body_snippet: body.substring(0, 100),
    //     sent_at: new Date()
    //   });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email queued for ${targetUsers.length} users`,
        recipients: targetUsers.length
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in admin-email-users function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
