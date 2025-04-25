
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Clock 
} from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useNavigate } from 'react-router-dom';

const TicketManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the hook with admin-specific filters
  const {
    tickets,
    isLoading,
    isError,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    refetch
  } = useTickets({ 
    // Admin can see all tickets by default
    page: 1,
    limit: 20
  });
  
  // Helper to format the date
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
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm, page: 1 });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update filters based on selected tab
    switch (value) {
      case 'open':
        updateFilters({ status: 'open', page: 1 });
        break;
      case 'pending':
        updateFilters({ status: 'pending', page: 1 });
        break;
      case 'resolved':
        updateFilters({ status: 'resolved', page: 1 });
        break;
      case 'closed':
        updateFilters({ status: 'closed', page: 1 });
        break;
      case 'all':
      default:
        updateFilters({ status: undefined, page: 1 });
        break;
    }
  };
  
  const handleViewTicket = (ticketId: string) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  // Placeholder data for analytics
  const stats = {
    totalTickets: 243,
    openTickets: 58,
    avgResponseTime: '3.2 hours',
    resolutionRate: '94%'
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Support Ticket Management</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
              <h3 className="text-2xl font-bold">{stats.totalTickets}</h3>
            </div>
            <BarChart3 className="h-8 w-8 text-puzzle-aqua opacity-50" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <h3 className="text-2xl font-bold">{stats.openTickets}</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-puzzle-gold opacity-50" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              <h3 className="text-2xl font-bold">{stats.avgResponseTime}</h3>
            </div>
            <Clock className="h-8 w-8 text-puzzle-aqua opacity-50" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <h3 className="text-2xl font-bold">{stats.resolutionRate}</h3>
            </div>
            <Users className="h-8 w-8 text-puzzle-aqua opacity-50" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <CardTitle>Support Tickets</CardTitle>
            
            <div className="flex items-center space-x-2">
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 md:w-64"
                />
                <Button type="submit" variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <Select 
                defaultValue="all"
                onValueChange={(value) => updateFilters({ priority: value === 'all' ? undefined : value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
            
            <TabsContent value={activeTab} className="pt-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <RefreshCw className="h-6 w-6 animate-spin text-puzzle-aqua" />
                </div>
              ) : isError ? (
                <div className="p-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-2" />
                  <p className="text-destructive">Failed to load tickets data</p>
                  <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-2">
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tickets?.length > 0 ? (
                          tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                              <TableCell className="font-medium">{ticket.id}</TableCell>
                              <TableCell>{ticket.title}</TableCell>
                              <TableCell>{ticket.userEmail}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    ticket.priority === 'low' ? 'outline' :
                                    ticket.priority === 'medium' ? 'default' :
                                    ticket.priority === 'high' ? 'secondary' : 'destructive'
                                  }
                                >
                                  {ticket.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    ticket.status === 'open' ? 'default' :
                                    ticket.status === 'pending' ? 'outline' :
                                    ticket.status === 'resolved' ? 'secondary' : 'destructive'
                                  }
                                >
                                  {ticket.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(ticket.date)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewTicket(ticket.id)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No tickets found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Page {filters.page} • Showing {tickets?.length || 0} tickets
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
    </div>
  );
};

export default TicketManagement;
