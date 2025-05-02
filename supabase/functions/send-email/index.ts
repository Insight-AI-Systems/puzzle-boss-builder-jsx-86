
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Add types for request body
interface EmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  from?: string;
  campaignId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'Unauthorized request, missing Authorization header'
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get request body
    const requestData: EmailRequest = await req.json();
    
    // Validate request
    if (!requestData.to || !requestData.subject || (!requestData.html && !requestData.text && !requestData.templateId)) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: to, subject, and either html, text, or templateId'
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Prepare SendGrid payload
    const fromEmail = requestData.from || 'noreply@puzzleboss.com';
    
    const payload = {
      personalizations: [
        {
          to: Array.isArray(requestData.to) ? 
            requestData.to.map(email => ({ email })) : 
            [{ email: requestData.to }],
          subject: requestData.subject,
          dynamic_template_data: requestData.dynamicTemplateData
        }
      ],
      from: { email: fromEmail },
      content: [],
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true }
      }
    };
    
    // Add template ID or content
    if (requestData.templateId) {
      // @ts-ignore: Type 'string' is not assignable to type 'never[]'
      payload.template_id = requestData.templateId;
    } else {
      if (requestData.html) {
        // @ts-ignore: Type '{ type: string; value: string; }[]' is not assignable to type 'never[]'
        payload.content = [
          {
            type: 'text/html',
            value: requestData.html
          }
        ];
      }
      
      if (requestData.text && !requestData.html) {
        // @ts-ignore: Type '{ type: string; value: string; }[]' is not assignable to type 'never[]'
        payload.content = [
          {
            type: 'text/plain',
            value: requestData.text
          }
        ];
      }
    }
    
    // Add campaign ID if provided
    if (requestData.campaignId) {
      // @ts-ignore: Property 'campaign_id' does not exist on type...
      payload.campaign_id = requestData.campaignId;
    }

    // Get SendGrid API key from environment variables
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      throw new Error('SendGrid API key is not set in the environment variables');
    }

    // Send the email via SendGrid
    const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sendgridApiKey}`
      },
      body: JSON.stringify(payload)
    });

    // Check for errors from SendGrid
    if (!sendgridResponse.ok) {
      const errorData = await sendgridResponse.json();
      console.error('SendGrid API error:', errorData);
      
      return new Response(JSON.stringify({
        error: 'Failed to send email through SendGrid',
        details: errorData
      }), {
        status: sendgridResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    // Handle any errors
    console.error('Error in send-email function:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to send email',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
