
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IssueType } from "@/types/issueTypes";
import { IssueEditForm } from "./edit-dialog/IssueEditForm";
import { useAuth } from "@/contexts/AuthContext";

interface AddIssueDialogProps {
  onAdd: (newIssue: IssueType) => Promise<boolean>;
}

export function AddIssueDialog({ onAdd }: AddIssueDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedIssue, setEditedIssue] = useState<IssueType>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    status: "open",
    category: "bug",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (issue: IssueType) => {
    setEditedIssue(issue);
  };

  const handleSave = async () => {
    if (!editedIssue.title || !editedIssue.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and description before saving.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add an issue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      console.log("Attempting to save issue:", editedIssue);
      
      // Make sure we're using the most up-to-date data with current timestamps
      const issueToSave = {
        ...editedIssue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const success = await onAdd(issueToSave);
      console.log("Add result:", success);
      
      if (success) {
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Error creating issue:", err);
      toast({
        title: "Creation Failed",
        description: "Failed to create the issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      // When opening, initialize with a fresh UUID
      setEditedIssue({
        id: crypto.randomUUID(),
        title: "",
        description: "",
        status: "open",
        category: "bug",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Issue</DialogTitle>
        </DialogHeader>
        <IssueEditForm 
          editedIssue={editedIssue}
          setEditedIssue={handleChange}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Issue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
