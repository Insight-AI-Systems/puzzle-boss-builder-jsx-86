
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailNotificationPayload {
  recipientEmail: string;
  ticketTitle: string;
  ticketId: string;
  updateType: 'status' | 'comment';
  newStatus?: string;
  commentAuthor?: string;
  commentContent?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      recipientEmail, 
      ticketTitle,
      ticketId,
      updateType,
      newStatus,
      commentAuthor,
      commentContent 
    }: EmailNotificationPayload = await req.json();

    let subject, htmlContent;

    if (updateType === 'status') {
      subject = `Ticket Status Updated: ${ticketTitle}`;
      htmlContent = `
        <h2>Ticket Status Update</h2>
        <p>The status of ticket "${ticketTitle}" has been updated to: <strong>${newStatus}</strong></p>
        <p>You can view the ticket details <a href="${Deno.env.get('SITE_URL')}/support/tickets/${ticketId}">here</a>.</p>
      `;
    } else {
      subject = `New Comment on Ticket: ${ticketTitle}`;
      htmlContent = `
        <h2>New Comment Added</h2>
        <p>A new comment has been added to ticket "${ticketTitle}" by ${commentAuthor}:</p>
        <p style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #0070f3;">
          ${commentContent}
        </p>
        <p>You can view the full conversation <a href="${Deno.env.get('SITE_URL')}/support/tickets/${ticketId}">here</a>.</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: 'Support System <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log('Email notification sent:', emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
