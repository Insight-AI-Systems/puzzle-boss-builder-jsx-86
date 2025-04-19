
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
const adminEmail = 'admin@thepuzzleboss.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PartnershipFormData {
  name: string;
  email: string;
  company: string;
  position: string;
  interest: string;
  budget: string;
  message: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sendgridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'partnerships@thepuzzleboss.com', name: 'The Puzzle Boss Partnerships' },
      subject: subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  return response;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: PartnershipFormData = await req.json();

    // Send notification to admin
    const adminEmailHtml = `
      <h2>New Partnership Inquiry</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Company:</strong> ${formData.company}</p>
      <p><strong>Position:</strong> ${formData.position}</p>
      <p><strong>Partnership Interest:</strong> ${formData.interest}</p>
      <p><strong>Budget Range:</strong> ${formData.budget}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message}</p>
    `;

    await sendEmail(
      adminEmail,
      'New Partnership Inquiry',
      adminEmailHtml
    );

    // Send acknowledgment to submitter
    const submitterEmailHtml = `
      <h2>Thank you for your interest in partnering with The Puzzle Boss!</h2>
      <p>Dear ${formData.name},</p>
      <p>We have received your partnership inquiry and appreciate your interest in collaborating with us. Our team will review your submission and get back to you very soon.</p>
      <p>In the meantime, if you have any urgent questions, please don't hesitate to reach out.</p>
      <br>
      <p>Best regards,</p>
      <p>The Puzzle Boss Partnerships Team</p>
    `;

    await sendEmail(
      formData.email,
      'Thank You for Your Partnership Inquiry',
      submitterEmailHtml
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in handle-partnership function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
