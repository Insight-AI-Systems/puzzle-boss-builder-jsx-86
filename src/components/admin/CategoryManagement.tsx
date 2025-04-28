
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CategoryManagement: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Category Management</CardTitle>
      <CardDescription>Manage puzzle categories and their settings</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        This section allows you to create, edit, and manage puzzle categories.
      </p>
    </CardContent>
  </Card>
);
