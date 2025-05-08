
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Users, Shield } from 'lucide-react';

interface UserTypeToggleProps {
  value: string;
  onChange: (value: 'regular' | 'admin' | 'player') => void;
}

export function UserTypeToggle({ value, onChange }: UserTypeToggleProps) {
  // This function ensures we always have a valid value, defaulting to 'regular'
  const handleValueChange = (newValue: string) => {
    if (newValue === 'admin' || newValue === 'player') {
      onChange(newValue);
    } else {
      onChange('regular');
    }
  };
  
  return (
    <div className="mb-6">
      <ToggleGroup 
        type="single" 
        value={value}
        onValueChange={handleValueChange}
        className="border rounded-md flex w-full sm:w-auto justify-start"
      >
        <ToggleGroupItem 
          value="regular" 
          aria-label="View regular users"
          className="flex-1 sm:flex-none"
        >
          <Users className="h-4 w-4 mr-2" />
          <span>Regular Users</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="admin" 
          aria-label="View admin users"
          className="flex-1 sm:flex-none"
        >
          <Shield className="h-4 w-4 mr-2" />
          <span>Admins</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
