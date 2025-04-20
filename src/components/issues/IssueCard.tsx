
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle, Edit, Trash2, X } from 'lucide-react';
import { Issue, IssueStatus } from '@/types/issueTypes';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IssueForm } from './IssueForm';
import { Badge } from '@/components/ui/badge';

interface IssueCardProps {
  issue: Issue;
  onUpdateStatus: (id: string, status: IssueStatus) => Promise<boolean>;
  onUpdateIssue: (id: string, data: { title: string; description: string; category?: string | null }) => Promise<boolean>;
  onDeleteIssue: (id: string) => Promise<boolean>;
}

export function IssueCard({ issue, onUpdateStatus, onUpdateIssue, onDeleteIssue }: IssueCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleStatus = async () => {
    const newStatus: IssueStatus = issue.status === 'wip' ? 'completed' : 'wip';
    await onUpdateStatus(issue.id, newStatus);
  };

  const handleUpdateIssue = async (data: { title: string; description: string; category?: string | null }) => {
    setIsSubmitting(true);
    const success = await onUpdateIssue(issue.id, data);
    setIsSubmitting(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDeleteIssue = async () => {
    setIsSubmitting(true);
    const success = await onDeleteIssue(issue.id);
    setIsSubmitting(false);
    if (success) {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card className={`hover:shadow-md transition-shadow ${issue.status === 'completed' ? 'bg-green-50/30' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-medium mr-2">{issue.title}</CardTitle>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={issue.status === 'completed' ? 'text-green-600' : 'text-amber-500'}
                onClick={handleToggleStatus}
                title={issue.status === 'completed' ? 'Mark as Work in Progress' : 'Mark as Completed'}
              >
                {issue.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                title="Edit Issue"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-600" 
                onClick={() => setIsDeleting(true)}
                title="Delete Issue"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant={issue.status === 'completed' ? 'outline' : 'default'}>
              {issue.status === 'completed' ? 'Completed' : 'Work in Progress'}
            </Badge>
            {issue.category && (
              <Badge variant="secondary">{issue.category}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm whitespace-pre-wrap">{issue.description}</p>
        </CardContent>
        <CardFooter className="pt-2 text-xs text-muted-foreground flex flex-wrap justify-between">
          <div>
            Created by {issue.creator_name} {formatDate(issue.created_at)}
          </div>
          {issue.updated_at !== issue.created_at && (
            <div>
              Updated by {issue.modifier_name} {formatDate(issue.updated_at)}
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>
          <IssueForm 
            onSubmit={handleUpdateIssue} 
            initialData={{
              title: issue.title,
              description: issue.description,
              category: issue.category
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the issue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600" 
              onClick={handleDeleteIssue}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
