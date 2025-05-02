
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { TemplateList } from "./TemplateList";
import { TemplateDialog } from "./TemplateDialog";
import { useToast } from "@/hooks/use-toast";
import { EmailTemplate } from "./types";
import { useEmailTemplates } from "@/hooks/admin/useEmailTemplates";
import { Loader2 } from "lucide-react";

export const EmailTemplates: React.FC = () => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const { toast } = useToast();
  const { 
    templates,
    isLoading,
    error,
    createTemplate,
    deleteTemplate,
    refreshTemplates 
  } = useEmailTemplates();

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    // In a real implementation, you would show a preview modal here
    toast({
      title: "Template preview",
      description: `Previewing template "${template.name}"`,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
      toast({
        title: "Template deleted",
        description: "Email template has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleCreateTemplate = async (data: Omit<EmailTemplate, 'id' | 'created_at' | 'last_sent' | 'status'>) => {
    try {
      await createTemplate({
        ...data,
        status: 'draft'
      });
      setIsTemplateDialogOpen(false);
      toast({
        title: "Template created",
        description: "Email template has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleSendTest = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to your address.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Email Templates</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={refreshTemplates} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button onClick={() => setIsTemplateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error instanceof Error ? error.message : "An error occurred while loading templates"}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : templates && templates.length > 0 ? (
        <TemplateList 
          templates={templates}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No email templates found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsTemplateDialogOpen(true)}
          >
            Create your first template
          </Button>
        </div>
      )}

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSubmit={handleCreateTemplate}
        onSendTest={handleSendTest}
      />
    </div>
  );
};
