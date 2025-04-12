
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getRoleDisplayName } from '@/utils/permissions';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Component to display the list of users in the admin dashboard
 * Heavily optimized to reduce data payload
 */
const UsersList = ({ users, selectedUser, onSelectUser }) => {
  const [currentPage, setCurrentPage] = useState(1);
  // Further reduced items per page to limit data displayed at once
  const itemsPerPage = 5;
  
  // Calculate pagination values
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(current => current + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(current => current - 1);
    }
  };

  // Simplified table with only critical information
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow 
                  key={user.id}
                  className={`cursor-pointer ${selectedUser?.id === user.id ? 'bg-puzzle-aqua/10' : ''}`}
                  onClick={() => onSelectUser(user)}
                >
                  <TableCell className="font-medium">
                    {user.username || 'No username'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-puzzle-gold text-puzzle-gold">
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUser(user);
                      }}
                      className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {users.length > itemsPerPage && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={goToPreviousPage}
                className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} border-puzzle-aqua/30 text-puzzle-white`}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-puzzle-white mx-2">
                {currentPage}/{totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={goToNextPage}
                className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} border-puzzle-aqua/30 text-puzzle-white`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default UsersList;
