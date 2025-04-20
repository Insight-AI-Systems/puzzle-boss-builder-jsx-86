
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
const adminEmail = 'admin@thepuzzleboss.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
  if (!sendgridApiKey) {
    console.error("SENDGRID_API_KEY environment variable is not set");
    throw new Error("Email service configuration error");
  }

  console.log(`Attempting to send email to: ${to}`);
  
  try {
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
      const errorData = await response.text();
      console.error(`SendGrid API error response: ${errorData}`);
      throw new Error(`SendGrid API error: ${response.status} ${errorData}`);
    }

    console.log(`Email successfully sent to: ${to}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log("Partnership form submission received");
    
    // Parse form data
    const formData: PartnershipFormData = await req.json();
    console.log("Form data:", formData);

    // Validate required fields
    const requiredFields = ['name', 'email', 'company', 'position', 'interest', 'budget', 'message'];
    for (const field of requiredFields) {
      if (!formData[field as keyof PartnershipFormData]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Prepare result object for response
    const result = {
      success: false,
      adminEmailSent: false,
      userEmailSent: false,
      message: "",
      error: null
    };

    // Check if SendGrid API key is configured
    if (!sendgridApiKey) {
      return new Response(
        JSON.stringify({ 
          error: "Email service configuration error. Please contact support." 
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Try to send admin notification email
    try {
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
      
      result.adminEmailSent = true;
      console.log("Admin notification email sent successfully");
    } catch (error) {
      console.error("Error sending admin email:", error);
      result.error = error.message;
    }

    // Try to send user acknowledgment email
    try {
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
      
      result.userEmailSent = true;
      console.log("User acknowledgment email sent successfully");
    } catch (error) {
      console.error("Error sending user acknowledgment email:", error);
      if (!result.error) result.error = error.message;
    }

    // If at least one email was sent, consider it a partial success
    if (result.adminEmailSent || result.userEmailSent) {
      result.success = true;
      result.message = "Your inquiry has been recorded. Thank you for your interest!";
      
      return new Response(
        JSON.stringify(result), 
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      // If both emails failed, return an error
      throw new Error(result.error || "Failed to send emails");
    }
  } catch (error) {
    console.error('Error in handle-partnership function:', error);
    return new Response(
      JSON.stringify({ 
        error: "There was a problem submitting your inquiry. Please try again later or contact us directly." 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
