
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { IssueType } from "@/types/issueTypes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { IssueEditForm } from "./IssueEditForm";
import { ErrorDialog } from "./ErrorDialog";

interface IssueEditDialogProps {
  issue: IssueType;
  onUpdate: (updatedIssue: IssueType) => Promise<boolean>;
}

export function IssueEditDialog({ issue, onUpdate }: IssueEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedIssue, setEditedIssue] = useState<IssueType>(issue);
  const [isSaving, setIsSaving] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update issues.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const updatedIssue: IssueType = {
        ...editedIssue,
        modified_by: user.id || editedIssue.modified_by || '',
        updated_at: new Date().toISOString()
      };

      const success = await onUpdate(updatedIssue);
      
      if (success) {
        setIsOpen(false);
        toast({
          title: "Issue Updated",
          description: `Issue successfully changed to ${updatedIssue.status} status.`,
        });
      } else {
        setErrorMessage("Failed to update the issue. Please check console for details.");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setShowErrorDialog(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditedIssue({...issue});
    } else {
      if (!isSaving) {
        setIsOpen(open);
      }
    }
    setIsOpen(open);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>
          <IssueEditForm 
            editedIssue={editedIssue}
            setEditedIssue={setEditedIssue}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ErrorDialog 
        isOpen={showErrorDialog}
        message={errorMessage}
        onClose={() => setShowErrorDialog(false)}
      />
    </>
  );
}
