
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { IssueType, mapFrontendStatusToDb } from "@/types/issueTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface IssueEditDialogProps {
  issue: IssueType;
  onUpdate: (updatedIssue: IssueType) => void;
}

export function IssueEditDialog({ issue, onUpdate }: IssueEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedIssue, setEditedIssue] = useState<IssueType>(issue);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    try {
      // Map frontend status to database status
      const dbStatus = mapFrontendStatusToDb(editedIssue.status);
      
      const { data, error } = await supabase
        .from('issues')
        .update({
          title: editedIssue.title,
          description: editedIssue.description,
          status: dbStatus,
          category: editedIssue.category,
          severity: editedIssue.severity,
          workaround: editedIssue.workaround,
          modified_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', issue.id)
        .select()
        .single();

      if (error) throw error;

      // Map back to our frontend issue type
      const updatedIssue: IssueType = {
        ...editedIssue,
        modified_by: user?.id || editedIssue.modified_by || '',
        updated_at: new Date().toISOString()
      };

      onUpdate(updatedIssue);
      setIsOpen(false);
      toast({
        title: "Issue updated",
        description: "The issue has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the issue. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={editedIssue.severity}
                onValueChange={(value: IssueType['severity']) => 
                  setEditedIssue({ ...editedIssue, severity: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
