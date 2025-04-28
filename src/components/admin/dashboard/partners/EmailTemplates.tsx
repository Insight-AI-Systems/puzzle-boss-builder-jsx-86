
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  PlusCircle, 
  Mail, 
  Copy, 
  Check 
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface EmailTemplatesProps {
  partnerId: string;
  partnerName?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'invitation' | 'welcome' | 'contract' | 'followup' | 'reminder';
}

const EmailTemplates: React.FC<EmailTemplatesProps> = ({ partnerId, partnerName }) => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Example email templates - in a real app these would be fetched from the database
  const templates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Initial Partnership Invitation',
      subject: 'Invitation to Partner with The Puzzle Boss',
      content: `Dear [Partner Name],

We're excited to invite you to partner with The Puzzle Boss, the leading skill-based jigsaw puzzle platform. Your products would be a perfect fit for our prize offerings.

Our platform hosts thousands of players daily who compete to win premium prizes like yours. This partnership would provide excellent exposure for your brand.

Would you be interested in discussing how we can feature your products on our platform? We can offer various partnership models to suit your needs.

Looking forward to your response,
The Puzzle Boss Team`,
      type: 'invitation'
    },
    {
      id: '2',
      name: 'Welcome to Partnership',
      subject: 'Welcome to The Puzzle Boss Partner Program',
      content: `Dear [Partner Name],

Welcome to The Puzzle Boss Partner Program! We're thrilled to have you onboard.

Your account has been set up, and you can now start submitting your products through our partner portal. Here's how to get started:

1. Log in at partners.puzzleboss.com using the credentials sent separately
2. Complete your company profile
3. Submit your first product for approval

If you need any assistance, please don't hesitate to contact your dedicated partner manager.

Best regards,
The Puzzle Boss Partnership Team`,
      type: 'welcome'
    },
    {
      id: '3',
      name: 'Partnership Agreement',
      subject: 'The Puzzle Boss - Partnership Agreement for Review',
      content: `Dear [Partner Name],

Thank you for your interest in partnering with The Puzzle Boss. Attached is our partnership agreement for your review.

The agreement outlines:
- Terms of the partnership
- Commission structure
- Product submission requirements
- Payment schedules
- Promotional opportunities

Please review the document and let us know if you have any questions. To proceed, please sign the agreement electronically through the link provided.

We look forward to a successful partnership!

Best regards,
The Puzzle Boss Legal Team`,
      type: 'contract'
    },
    {
      id: '4',
      name: 'Product Approval Notification',
      subject: 'Your Product Has Been Approved',
      content: `Dear [Partner Name],

Great news! Your product "[Product Name]" has been approved and will be featured on The Puzzle Boss platform.

Your product will be available as a prize starting on [Start Date]. We'll notify you when players win your product so you can arrange fulfillment.

If you have any questions about the process or need to update product information, please contact your partner manager.

Thank you for providing quality prizes for our players!

Regards,
The Puzzle Boss Product Team`,
      type: 'followup'
    },
  ];
  
  const handleCopyTemplate = (template: EmailTemplate) => {
    // Replace placeholder with actual partner name if available
    const processedContent = template.content.replace('[Partner Name]', partnerName || '[Partner Name]');
    const processedSubject = template.subject;
    
    // Copy to clipboard
    navigator.clipboard.writeText(`Subject: ${processedSubject}\n\n${processedContent}`);
    
    // Set copied ID to show check icon
    setCopiedId(template.id);
    
    // Show toast notification
    toast({
      title: "Template copied",
      description: "Email template has been copied to clipboard.",
    });
    
    // Reset copied icon after 2 seconds
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Email Templates</h3>
          <p className="text-sm text-gray-500">Use these templates to quickly send common emails</p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{template.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleCopyTemplate(template)}
                  className="h-8 w-8"
                >
                  {copiedId === template.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
              <CardDescription className="font-medium">
                Subject: {template.subject}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="text-gray-700 whitespace-pre-line text-sm max-h-[150px] overflow-y-auto"
              >
                {template.content.replace('[Partner Name]', partnerName || '[Partner Name]')}
              </div>
              <div className="mt-4 flex justify-between">
                <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                  {template.type}
                </span>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopyTemplate(template)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmailTemplates;
