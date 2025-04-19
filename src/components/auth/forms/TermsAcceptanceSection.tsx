
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TermsAcceptanceSectionProps {
  hasReadTerms: boolean;
  hasReadPrivacy: boolean;
  acceptTerms: boolean;
  isLoading: boolean;
  setAcceptTerms: (checked: boolean) => void;
  setShowTerms: (show: boolean) => void;
  setShowPrivacy: (show: boolean) => void;
}

export const TermsAcceptanceSection: React.FC<TermsAcceptanceSectionProps> = ({
  hasReadTerms,
  hasReadPrivacy,
  acceptTerms,
  isLoading,
  setAcceptTerms,
  setShowTerms,
  setShowPrivacy
}) => {
  const { toast } = useToast();
  const canAcceptTerms = hasReadTerms && hasReadPrivacy;

  const handleTermsCheckAttempt = (checked: boolean) => {
    if (!canAcceptTerms && checked) {
      const unreadDocs = [];
      if (!hasReadTerms) unreadDocs.push('Terms of Service');
      if (!hasReadPrivacy) unreadDocs.push('Privacy Policy');

      toast({
        title: "Documents Required",
        description: (
          <div className="flex flex-col space-y-2">
            <p>Please read the following before accepting:</p>
            <div className="flex flex-col space-y-1">
              {!hasReadTerms && (
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-left text-puzzle-aqua underline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowTerms(true);
                  }}
                  type="button"
                >
                  Terms of Service
                </Button>
              )}
              {!hasReadPrivacy && (
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-left text-puzzle-aqua underline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPrivacy(true);
                  }}
                  type="button"
                >
                  Privacy Policy
                </Button>
              )}
            </div>
          </div>
        ),
        variant: "default",
      });
      return;
    }
    setAcceptTerms(checked);
  };

  return (
    <div className="flex flex-col space-y-2 pt-2">
      {!canAcceptTerms && (
        <div className="text-puzzle-aqua text-sm font-medium animate-pulse-gentle mb-2 flex items-center">
          <Info className="inline-block h-4 w-4 mr-2" />
          Please read both documents before accepting
        </div>
      )}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="signup-terms"
          checked={acceptTerms}
          onCheckedChange={handleTermsCheckAttempt}
          disabled={!canAcceptTerms || isLoading}
        />
        <div className="grid gap-1.5 leading-none">
          <Label 
            htmlFor="signup-terms" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium text-puzzle-aqua underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTerms(true);
              }}
              type="button"
            >
              Terms of Service
            </Button>
            {" "}and{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium text-puzzle-aqua underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPrivacy(true);
              }}
              type="button"
            >
              Privacy Policy
            </Button>
          </Label>
          {!canAcceptTerms && (
            <p className="text-sm text-muted-foreground">
              Please read both documents before accepting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
