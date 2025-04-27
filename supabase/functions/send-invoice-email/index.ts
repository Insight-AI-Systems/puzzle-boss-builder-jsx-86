
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  paymentIds: string[];
}

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

    if (paymentsError) throw paymentsError;

    const { data: template } = await supabaseClient
      .from('invoice_templates')
      .select('*')
      .eq('is_default', true)
      .single();

    if (!template) throw new Error('No default template found');

    for (const payment of payments) {
      const emailContent = template.content
        .replace('{{invoice_number}}', payment.invoice_number)
        .replace('{{period}}', payment.period)
        .replace('{{manager_name}}', payment.manager?.profiles?.username || 'Unknown')
        .replace('{{category_name}}', payment.categories?.name || 'Unknown')
        .replace('{{commission_amount}}', payment.commission_amount.toFixed(2))
        .replace('{{payment_status}}', payment.payment_status);

      const emailData = {
        personalizations: [{
          to: [{ email: payment.manager?.email }],
        }],
        from: { email: "noreply@puzzleboss.com" },
        subject: `Commission Invoice - ${payment.period}`,
        content: [{
          type: 'text/html',
          value: emailContent,
        }],
      };

      const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!sendgridResponse.ok) {
        const error = await sendgridResponse.text();
        await supabaseClient
          .from('commission_payments')
          .update({
            email_status: 'error',
            email_error: error,
          })
          .eq('id', payment.id);
        
        throw new Error(`Failed to send email: ${error}`);
      }

      await supabaseClient
        .from('commission_payments')
        .update({
          email_status: 'sent',
          email_sent_at: new Date().toISOString(),
          email_error: null,
        })
        .eq('id', payment.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
