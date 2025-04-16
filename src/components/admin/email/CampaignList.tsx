
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { EmailCampaign } from "./types";

interface CampaignListProps {
  campaigns: EmailCampaign[];
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Open Rate</TableHead>
            <TableHead>Scheduled For</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge className={
                    campaign.status === 'completed' ? 'bg-green-600' :
                    campaign.status === 'in_progress' ? 'bg-blue-600' :
                    campaign.status === 'scheduled' ? 'bg-amber-600' :
                    'bg-gray-600'
                  }>
                    {campaign.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{campaign.audience}</TableCell>
                <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                <TableCell>
                  {campaign.sent > 0 ? `${Math.round((campaign.opened / campaign.sent) * 100)}%` : '-'}
                </TableCell>
                <TableCell>
                  {campaign.scheduled_for ? new Date(campaign.scheduled_for).toLocaleString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No campaigns found. Try adjusting your search or create a new campaign.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

