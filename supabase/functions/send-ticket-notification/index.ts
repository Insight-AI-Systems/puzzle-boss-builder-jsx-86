
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
const siteUrl = Deno.env.get("SITE_URL") || "https://puzzleboss.com";

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

    if (!sendgridApiKey) {
      throw new Error("SendGrid API key is not configured");
    }

    let subject, htmlContent;

    if (updateType === 'status') {
      subject = `Ticket Status Updated: ${ticketTitle}`;
      htmlContent = `
        <h2>Ticket Status Update</h2>
        <p>The status of ticket "${ticketTitle}" has been updated to: <strong>${newStatus}</strong></p>
        <p>You can view the ticket details <a href="${siteUrl}/support/tickets/${ticketId}">here</a>.</p>
      `;
    } else {
      subject = `New Comment on Ticket: ${ticketTitle}`;
      htmlContent = `
        <h2>New Comment Added</h2>
        <p>A new comment has been added to ticket "${ticketTitle}" by ${commentAuthor}:</p>
        <p style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #0070f3;">
          ${commentContent}
        </p>
        <p>You can view the full conversation <a href="${siteUrl}/support/tickets/${ticketId}">here</a>.</p>
      `;
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: recipientEmail }],
          subject: subject,
        }],
        from: { 
          email: 'support@puzzleboss.com', 
          name: 'Puzzle Boss Support' 
        },
        content: [{
          type: 'text/html',
          value: htmlContent
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API error:', errorText);
      throw new Error(`Email sending failed: ${errorText}`);
    }

    console.log('Email notification sent successfully');

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
