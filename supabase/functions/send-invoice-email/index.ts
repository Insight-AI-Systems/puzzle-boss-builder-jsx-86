
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  paymentIds: string[];
}

// Helper function to log errors with better context
const logError = (message: string, error: any): string => {
  const errorDetails = error instanceof Error 
    ? `${error.message}\n${error.stack}` 
    : JSON.stringify(error);
  
  console.error(`[ERROR] ${message}: ${errorDetails}`);
  return message;
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { paymentIds }: EmailRequest = await req.json();
    
    if (!Array.isArray(paymentIds) || paymentIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No payment IDs provided" }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use background task for the actual email sending
    EdgeRuntime.waitUntil(sendEmails(supabaseClient, paymentIds));

    return new Response(
      JSON.stringify({ success: true, message: "Email sending has been queued" }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = logError("Request handling error", error);
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Background task function for sending emails
async function sendEmails(supabaseClient: any, paymentIds: string[]) {
  try {
    console.log(`Starting email sending process for ${paymentIds.length} payment(s)`);
    
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('commission_payments')
      .select(`
        *,
        categories:category_id (name),
        manager:manager_id (
          email,
          profiles:id (username)
        )
      `)
      .in('id', paymentIds);

    if (paymentsError) throw new Error(`Error fetching payments: ${paymentsError.message}`);
    
    console.log(`Found ${payments.length} payment records to process`);

    const { data: template, error: templateError } = await supabaseClient
      .from('invoice_templates')
      .select('*')
      .eq('is_default', true)
      .single();

    if (templateError) throw new Error(`Error fetching template: ${templateError.message}`);
    if (!template) throw new Error('No default template found');

    console.log('Successfully retrieved email template');

    for (const payment of payments) {
      try {
        if (!payment.manager?.email) {
          console.warn(`No email found for manager of payment ID: ${payment.id}`);
          await updatePaymentEmailStatus(supabaseClient, payment.id, 'error', 'No manager email found');
          continue;
        }
        
        const emailContent = prepareEmailContent(template.content, payment);
        console.log(`Sending email for payment ID: ${payment.id} to ${payment.manager.email}`);
        
        const sendgridResponse = await sendEmail(
          payment.manager.email, 
          `Commission Invoice - ${payment.period}`, 
          emailContent
        );

        if (!sendgridResponse.ok) {
          const error = await sendgridResponse.text();
          throw new Error(`SendGrid API error: ${error}`);
        }

        console.log(`Successfully sent email for payment ID: ${payment.id}`);
        await updatePaymentEmailStatus(supabaseClient, payment.id, 'sent');
      } catch (error) {
        const errorMessage = logError(`Error processing payment ID: ${payment.id}`, error);
        await updatePaymentEmailStatus(supabaseClient, payment.id, 'error', errorMessage);
      }
    }

    console.log('Email sending process completed');
  } catch (error) {
    logError("Background task error", error);
  }
}

// Helper function to prepare email content
function prepareEmailContent(templateContent: string, payment: any): string {
  return templateContent
    .replace('{{invoice_number}}', payment.invoice_number || `INV-${payment.id.substring(0, 8)}`)
    .replace('{{period}}', payment.period)
    .replace('{{manager_name}}', payment.manager?.profiles?.username || 'Manager')
    .replace('{{category_name}}', payment.categories?.name || 'Unknown Category')
    .replace('{{commission_amount}}', payment.commission_amount.toFixed(2))
    .replace('{{payment_status}}', payment.payment_status);
}

// Helper function to send email via SendGrid
async function sendEmail(to: string, subject: string, htmlContent: string): Promise<Response> {
  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
  
  if (!sendgridApiKey) {
    throw new Error('SendGrid API key is not configured');
  }
  
  const emailData = {
    personalizations: [{
      to: [{ email: to }],
    }],
    from: { email: "noreply@puzzleboss.com" },
    subject: subject,
    content: [{
      type: 'text/html',
      value: htmlContent,
    }],
  };

  return fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sendgridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });
}

// Helper function to update email status
async function updatePaymentEmailStatus(
  supabaseClient: any, 
  paymentId: string, 
  status: 'sent' | 'error', 
  errorMessage?: string
): Promise<void> {
  const updateData: Record<string, any> = {
    email_status: status,
    email_error: status === 'error' ? errorMessage : null,
  };
  
  if (status === 'sent') {
    updateData.email_sent_at = new Date().toISOString();
  }
  
  const { error } = await supabaseClient
    .from('commission_payments')
    .update(updateData)
    .eq('id', paymentId);
    
  if (error) {
    console.error(`Failed to update payment status for ID ${paymentId}:`, error);
  }
}

// Handle function shutdown gracefully
addEventListener('beforeunload', (ev) => {
  console.log('Function shutdown triggered:', ev.detail?.reason || 'unknown reason');
});
