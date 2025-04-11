
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

/**
 * Component to display the role permissions table
 */
const RolePermissionsTable = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Permissions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Super Admin</TableCell>
            <TableCell>Full system access with ability to manage all aspects of the platform</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-puzzle-gold text-puzzle-black">All Permissions</Badge>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Admin</TableCell>
            <TableCell>Manage users, puzzles, and content, but cannot change system settings</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Users</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Puzzles</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Categories</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Content</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">View Reports</Badge>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Category Manager</TableCell>
            <TableCell>Manage specific puzzle categories and their content</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Categories</Badge>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">CFO</TableCell>
            <TableCell>Manage financial aspects and view reports</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Finances</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">View Reports</Badge>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Social Media Manager</TableCell>
            <TableCell>Manage marketing and winner spotlights</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Marketing</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Winners</Badge>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Partner Manager</TableCell>
            <TableCell>Manage prize suppliers and partnerships</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Partners</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Prizes</Badge>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Player</TableCell>
            <TableCell>Standard user with basic gameplay access</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Play Puzzles</Badge>
                <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Profile</Badge>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default RolePermissionsTable;
