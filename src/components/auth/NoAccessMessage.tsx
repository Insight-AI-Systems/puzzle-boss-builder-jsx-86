
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from 'lucide-react';

interface NoAccessMessageProps {
  resourceName: string;
}

export const NoAccessMessage: React.FC<NoAccessMessageProps> = ({ resourceName }) => {
  return (
    <Alert variant="destructive" className="bg-red-900/20 text-red-200 border-red-800">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Access Restricted</AlertTitle>
      <AlertDescription>
        You don't have permission to view the {resourceName}. 
        Please contact an administrator if you believe this is an error.
      </AlertDescription>
    </Alert>
  );
};
