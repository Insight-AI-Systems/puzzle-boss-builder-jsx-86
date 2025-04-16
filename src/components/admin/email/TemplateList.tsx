
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { EmailTemplate } from "./types";

interface TemplateListProps {
  templates: EmailTemplate[];
  onPreview: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onPreview,
  onDelete,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Sent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.length > 0 ? (
            templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>{template.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    template.type === 'verification' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    template.type === 'notification' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    template.type === 'marketing' ? 'bg-green-100 text-green-800 border-green-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }>
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    template.status === 'active' ? 'bg-green-600' :
                    template.status === 'draft' ? 'bg-gray-600' :
                    'bg-red-600'
                  }>
                    {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {template.last_sent ? new Date(template.last_sent).toLocaleDateString() : 'Never sent'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onPreview(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500"
                      onClick={() => onDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No templates found. Try adjusting your filters or create a new template.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

