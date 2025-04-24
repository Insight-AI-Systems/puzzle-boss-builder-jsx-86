
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface SecurityOptionProps {
  title: string;
  description: string;
  action: React.ReactNode;
}

export function SecurityOption({ title, description, action }: SecurityOptionProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {action}
      </div>
      <Separator />
    </>
  );
}
