
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const ContentManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Manage site content and assets</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content management functionality is being set up. Please check back later.</p>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
