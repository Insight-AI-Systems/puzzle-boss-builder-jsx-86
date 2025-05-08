
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Users, Shield } from "lucide-react";

interface UserTypeToggleProps {
  value: 'regular' | 'admin';
  onChange: (value: 'regular' | 'admin') => void;
}

export function UserTypeToggle({ value, onChange }: UserTypeToggleProps) {
  return (
    <div className="flex justify-center mb-6">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => {
          if (val) onChange(val as 'regular' | 'admin');
        }}
        className="border rounded-lg p-1"
      >
        <ToggleGroupItem
          value="regular"
          className="flex items-center gap-1 px-4 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Users className="h-4 w-4" />
          Regular Users
        </ToggleGroupItem>
        <ToggleGroupItem
          value="admin"
          className="flex items-center gap-1 px-4 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Shield className="h-4 w-4" />
          Admin Users
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
