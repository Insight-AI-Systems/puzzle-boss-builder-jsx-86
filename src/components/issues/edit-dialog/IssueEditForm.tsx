
import { IssueType } from "@/types/issueTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IssueEditFormProps {
  editedIssue: IssueType;
  setEditedIssue: (issue: IssueType) => void;
}

export function IssueEditForm({ editedIssue, setEditedIssue }: IssueEditFormProps) {
  return (
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
  );
}
