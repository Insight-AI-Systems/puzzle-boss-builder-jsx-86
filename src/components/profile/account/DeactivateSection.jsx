
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PowerOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from '@/components/ui/use-toast';

const DeactivateSection = ({ loading, setLoading, onSignOut }) => {
  const { toast } = useToast();
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  
  const handleDeactivateAccount = async () => {
    // This would be implemented with Supabase auth in a real application
    setLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Account deactivated",
        description: "Your account has been deactivated. We're sorry to see you go!"
      });
      setLoading(false);
      
      // Sign the user out
      onSignOut();
    }, 1500);
  };
  
  return (
    <AccordionItem value="deactivate" className="border-puzzle-aqua/20">
      <AccordionTrigger className="text-puzzle-white">
        <div className="flex items-center">
          <PowerOff className="h-4 w-4 mr-2 text-puzzle-burgundy" />
          Deactivate Account
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {!showDeactivateConfirm ? (
          <div className="space-y-3">
            <Alert variant="destructive" className="bg-puzzle-burgundy/20 border-puzzle-burgundy text-puzzle-white">
              <AlertTriangle className="h-4 w-4 text-puzzle-burgundy" />
              <AlertDescription>
                Deactivating your account will remove your profile and all personal data. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <Button 
              variant="outline"
              className="w-full border-puzzle-burgundy text-puzzle-burgundy hover:bg-puzzle-burgundy/10"
              onClick={() => setShowDeactivateConfirm(true)}
            >
              Request Account Deactivation
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-puzzle-white">Are you sure you want to deactivate your account?</p>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="flex-1 border-puzzle-burgundy bg-puzzle-burgundy text-puzzle-white hover:bg-puzzle-burgundy/90"
                onClick={handleDeactivateAccount}
                disabled={loading}
              >
                {loading ? "Processing..." : "Yes, Deactivate"}
              </Button>
              <Button 
                className="flex-1 bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white hover:bg-puzzle-black/80"
                onClick={() => setShowDeactivateConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default DeactivateSection;
