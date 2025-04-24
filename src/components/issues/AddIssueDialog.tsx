
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IssueType } from "@/types/issueTypes";
import { IssueEditForm } from "./edit-dialog/IssueEditForm";

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

  const handleChange = (issue: IssueType) => {
    setEditedIssue(issue);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const success = await onAdd(editedIssue);
      
      if (success) {
        setIsOpen(false);
        toast({
          title: "Issue Created",
          description: "New issue has been successfully added.",
        });
        
        // Reset the form data after successful save
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
