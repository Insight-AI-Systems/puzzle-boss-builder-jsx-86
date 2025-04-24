
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { IssueType } from "@/types/issueTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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

      // Update the issue with the current timestamp and user
      const updatedIssue: IssueType = {
        ...editedIssue,
        modified_by: user.id || editedIssue.modified_by || '',
        updated_at: new Date().toISOString()
      };

      console.log("Saving issue:", updatedIssue);
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

  // Reset the edited issue when the dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditedIssue(issue);
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
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedIssue.title}
                onChange={(e) => setEditedIssue({ ...editedIssue, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedIssue.description}
                onChange={(e) => setEditedIssue({ ...editedIssue, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editedIssue.status}
                  onValueChange={(value: IssueType['status']) => 
                    setEditedIssue({ ...editedIssue, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="deferred">Deferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editedIssue.category}
                  onValueChange={(value: IssueType['category']) => 
                    setEditedIssue({ ...editedIssue, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="ui">UI</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workaround">Workaround (Optional)</Label>
              <Textarea
                id="workaround"
                value={editedIssue.workaround || ''}
                onChange={(e) => setEditedIssue({ ...editedIssue, workaround: e.target.value })}
              />
            </div>
          </div>
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

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Updating Issue</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
