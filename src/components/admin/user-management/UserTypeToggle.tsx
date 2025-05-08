
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User } from "lucide-react";

interface UserTypeToggleProps {
  value: 'regular' | 'admin';
  onChange: (userType: 'regular' | 'admin') => void;
}

export function UserTypeToggle({ value, onChange }: UserTypeToggleProps) {
  return (
    <div className="mb-6">
      <Tabs 
        defaultValue="regular" 
        value={value} 
        onValueChange={(newValue) => onChange(newValue as 'regular' | 'admin')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="regular" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="md:block">Regular Users</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="md:block">Admins & Managers</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
