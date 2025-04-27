
import React, { useState, useEffect } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { openSupportsAPI } from '@/services/openSupportsAPI';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TicketStatus, TicketPriority, Department } from '@/types/ticketTypes';
import { Search, Filter, RefreshCw } from 'lucide-react';

// Status badge component
const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const badgeVariant = 
    status === 'open' ? 'default' :
    status === 'pending' ? 'outline' :
    status === 'resolved' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant}>{status}</Badge>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const badgeVariant = 
    priority === 'low' ? 'outline' :
    priority === 'medium' ? 'default' :
    priority === 'high' ? 'secondary' : 'destructive';

  return (
    <Badge variant={badgeVariant}>{priority}</Badge>
  );
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function TicketManagement() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority | null>(null);
  
  const {
    tickets,
    isLoading,
    isError,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    refetch,
    updateTicketStatus
  } = useTickets({
    // Apply initial filter based on active tab
    status: activeTab !== 'all' ? activeTab as TicketStatus : undefined
  });
  
  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await openSupportsAPI.getDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    
    fetchDepartments();
  }, []);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'all') {
      updateFilters({ status: undefined });
    } else {
      updateFilters({ status: value as TicketStatus });
    }
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search, page: 1 });
  };
  
  // Handle department change
  const handleDepartmentChange = (value: string) => {
    const deptId = value === 'all' ? undefined : parseInt(value);
    setSelectedDepartment(value);
    updateFilters({ departmentId: deptId });
  };
  
  // Handle priority change
  const handlePriorityChange = (value: string) => {
    setSelectedPriority(value as TicketPriority || null);
    updateFilters({ priority: value as TicketPriority });
  };
  
  // Handle status change
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateTicketStatus(ticketId, newStatus);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Support Ticket Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <form onSubmit={handleSearch} className="flex w-full md:w-1/3 space-x-2">
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Button type="submit" size="icon" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex space-x-2">
              <Select value={selectedDepartment || ''} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedPriority || ''}
                onValueChange={(value) => handlePriorityChange(value as TicketPriority)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : isError ? (
              <div className="text-center p-8 text-red-500">
                <p>Failed to load tickets. Please try again.</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-2">
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets && tickets.length > 0 ? (
                        tickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.title}</TableCell>
                            <TableCell>{ticket.userEmail || 'Unknown'}</TableCell>
                            <TableCell>
                              {ticket.departmentId ? 
                                departments.find(d => d.id === ticket.departmentId)?.name || 'Unknown' 
                                : 'General'}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={ticket.status} />
                            </TableCell>
                            <TableCell>
                              <PriorityBadge priority={ticket.priority} />
                            </TableCell>
                            <TableCell>{formatDate(ticket.date || ticket.created_at)}</TableCell>
                            <TableCell>
                              <Select 
                                defaultValue={ticket.status} 
                                onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No tickets found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {filters.page} • {tickets?.length || 0} tickets
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={filters.page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={!tickets || tickets.length < filters.limit}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
