
import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { EmailDialog } from './user-management/EmailDialog';
import { UserStatsDisplay } from './user-management/UserStatsDisplay';
import { BulkRoleDialog } from './user-management/BulkRoleDialog';

export function UserManagement() {
  const {
    allProfilesData,
    isLoadingProfiles,
    profileError,
    handleExportUsers,
    totalPages,
    pageSize,
    selectedUsers,
    setSelectedUsers,
    emailDialogOpen,
    setEmailDialogOpen,
    bulkRole,
    setBulkRole,
    confirmRoleDialogOpen,
    setConfirmRoleDialogOpen,
    isBulkRoleChanging,
    handleRoleChange,
    handleBulkRoleChange,
    userStats
  } = useUserManagement(true, 'alan@insight-ai-systems.com');

  // Local state for table
  const [tablePageIndex, setTablePageIndex] = useState(0);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [searchFilter, setSearchFilter] = useState('');

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="ml-2"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              setSelectedUsers(prev => new Set(prev).add(row.original.id));
            } else {
              const newSet = new Set(selectedUsers);
              newSet.delete(row.original.id);
              setSelectedUsers(newSet);
            }
          }}
          aria-label="Select row"
          className="ml-2"
        />
      ),
    },
    {
      accessorKey: "id",
      header: "User ID",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "full_name",
      header: "Full Name",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role as UserRole;
        const roleDef = ROLE_DEFINITIONS[role];
        return (
          <Badge variant="secondary">{roleDef?.label || role}</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {Object.entries(ROLE_DEFINITIONS).map(([role, roleDef]) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleChange(user.id, role as UserRole)}
                >
                  Set as {roleDef.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    return (allProfilesData?.data || []).filter(user => 
      user.id.includes(searchFilter) || 
      (user.email && user.email.includes(searchFilter)) ||
      (user.display_name && user.display_name.toLowerCase().includes(searchFilter.toLowerCase()))
    );
  }, [allProfilesData?.data, searchFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: tablePageIndex,
        pageSize: tablePageSize,
      },
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: tablePageIndex, pageSize: tablePageSize });
        setTablePageIndex(newState.pageIndex);
        setTablePageSize(newState.pageSize);
      }
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  // Create a wrapper function that properly converts the string to UserRole
  const handleSetBulkRole = (role: string) => {
    setBulkRole(role as UserRole);
  };

  // Function to handle email sending - we'll implement a stub since this wasn't in the original hook
  const handleBulkEmailSend = (subject: string, body: string) => {
    console.log(`Sending email with subject "${subject}" to ${selectedUsers.size} users`);
    // This would normally call a function from the hook
    setEmailDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter users..."
          value={searchFilter}
          onChange={(event) => setSearchFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportUsers} disabled={isLoadingProfiles}>
            Export Users
          </Button>
          <Button onClick={() => setEmailDialogOpen(true)} disabled={selectedUsers.size === 0}>
            Send Bulk Email
          </Button>
          <Button onClick={() => setConfirmRoleDialogOpen(true)} disabled={selectedUsers.size === 0}>
            Change Bulk Role
          </Button>
        </div>
      </div>

      {userStats && (
        <UserStatsDisplay stats={userStats} />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingProfiles ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {allProfilesData?.count} total users
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium">Rows per page</Label>
          <select
            value={tablePageSize}
            onChange={(e) => {
              setTablePageSize(Number(e.target.value));
            }}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTablePageIndex(tablePageIndex - 1)}
            disabled={tablePageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTablePageIndex(tablePageIndex + 1)}
            disabled={tablePageIndex >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
      
      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        selectedCount={selectedUsers.size}
        onSend={handleBulkEmailSend}
      />
      
      <BulkRoleDialog
        open={confirmRoleDialogOpen}
        onOpenChange={setConfirmRoleDialogOpen}
        selectedCount={selectedUsers.size}
        bulkRole={bulkRole}
        setBulkRole={handleSetBulkRole}
        onUpdateRoles={handleBulkRoleChange}
        isUpdating={isBulkRoleChanging}
      />
    </div>
  );
}
