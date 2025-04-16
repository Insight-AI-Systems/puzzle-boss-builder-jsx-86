
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CategoryManagement: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Category Management</CardTitle>
      <CardDescription>Manage puzzle categories and items</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows category managers to create and organize puzzle categories.</p>
    </CardContent>
  </Card>
);
