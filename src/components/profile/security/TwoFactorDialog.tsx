
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface TwoFactorDialogProps {
  enabled: boolean;
  password: string;
  isLoading: boolean;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TwoFactorDialog({
  enabled,
  password,
  isLoading,
  showDialog,
  setShowDialog,
  setPassword,
  onSubmit
}: TwoFactorDialogProps) {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2">
          <Switch
            checked={enabled}
            onCheckedChange={() => setShowDialog(true)}
          />
          <span className="text-sm">
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {enabled ? 'Disable' : 'Enable'} Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            {enabled 
              ? 'This will remove the extra security from your account.' 
              : 'This will add an extra layer of security to your account.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="two-factor-password">Confirm Password</Label>
              <Input
                id="two-factor-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant={enabled ? "destructive" : "default"}
              disabled={isLoading || !password}
            >
              {isLoading ? 'Processing...' : (
                enabled ? 'Disable Two-Factor' : 'Enable Two-Factor'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
