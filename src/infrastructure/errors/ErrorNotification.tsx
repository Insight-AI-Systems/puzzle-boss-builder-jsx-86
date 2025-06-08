
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CustomError, errorLogger } from './ErrorLogger';
import { errorRecovery, RecoveryAction } from './ErrorRecovery';

interface ErrorNotificationProps {
  error: CustomError;
  onDismiss?: () => void;
  showRecoveryActions?: boolean;
}

export function ErrorNotification({ 
  error, 
  onDismiss, 
  showRecoveryActions = true 
}: ErrorNotificationProps) {
  const { toast } = useToast();
  const [recoveryActions, setRecoveryActions] = useState<RecoveryAction[]>([]);
  const [isExecutingRecovery, setIsExecutingRecovery] = useState(false);

  useEffect(() => {
    if (showRecoveryActions) {
      errorRecovery.getRecoveryActions(error).then(setRecoveryActions);
    }
  }, [error, showRecoveryActions]);

  useEffect(() => {
    // Log the error
    errorLogger.logError(error);

    // Show toast notification
    const toastVariant = error.severity === 'critical' || error.severity === 'high' 
      ? 'destructive' 
      : 'default';

    toast({
      title: error.name,
      description: error.userMessage,
      variant: toastVariant,
      action: recoveryActions.length > 0 ? (
        <div className="flex gap-2">
          {recoveryActions.slice(0, 2).map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleRecoveryAction(action)}
              disabled={isExecutingRecovery}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : undefined,
    });
  }, [error, recoveryActions, toast]);

  const handleRecoveryAction = async (action: RecoveryAction) => {
    setIsExecutingRecovery(true);
    try {
      const success = await errorRecovery.executeRecovery(action);
      if (success && onDismiss) {
        onDismiss();
      }
    } catch (recoveryError) {
      console.error('Recovery action failed:', recoveryError);
    } finally {
      setIsExecutingRecovery(false);
    }
  };

  // This component doesn't render anything visible
  // It only handles the side effects of error notifications
  return null;
}
