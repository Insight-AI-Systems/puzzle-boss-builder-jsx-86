
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const PasswordSection = ({ loading, setLoading }) => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // This would be implemented with Supabase auth in a real application
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully"
      });
      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };
  
  return (
    <AccordionItem value="password" className="border-puzzle-aqua/20">
      <AccordionTrigger className="text-puzzle-white">
        <div className="flex items-center">
          <Lock className="h-4 w-4 mr-2 text-puzzle-aqua" />
          Change Password
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
            />
          </div>
          <Button 
            type="submit"
            className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/80"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PasswordSection;
