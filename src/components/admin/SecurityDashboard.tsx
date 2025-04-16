
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, Search, ShieldAlert, User, Clock, RefreshCw, 
  GanttChart, AlertCircle, CheckCircle
} from "lucide-react";

export const SecurityDashboard: React.FC = () => {
  // Mock data for security logs
  const securityLogs = [
    { 
      id: '1', 
      timestamp: '2025-04-16T08:32:45Z', 
      event: 'admin_login', 
      user: 'admin@puzzleboss.com', 
      ip: '192.168.1.1', 
      severity: 'info',
      details: 'Successful login to admin portal'
    },
    { 
      id: '2', 
      timestamp: '2025-04-16T07:15:22Z', 
      event: 'failed_login_attempt', 
      user: 'user@example.com', 
      ip: '203.0.113.1', 
      severity: 'warning',
      details: 'Multiple failed login attempts (5)' 
    },
    { 
      id: '3', 
      timestamp: '2025-04-15T22:45:12Z', 
      event: 'puzzle_published', 
      user: 'category_manager@puzzleboss.com', 
      ip: '198.51.100.1', 
      severity: 'info',
      details: 'Published iPhone 15 Puzzle Challenge' 
    },
    { 
      id: '4', 
      timestamp: '2025-04-15T18:12:33Z', 
      event: 'user_role_changed', 
      user: 'superadmin@puzzleboss.com', 
      ip: '192.168.1.1', 
      severity: 'info',
      details: 'Changed user john@example.com from Player to Category Manager' 
    },
    { 
      id: '5', 
      timestamp: '2025-04-15T14:55:08Z', 
      event: 'suspicious_activity', 
      user: 'hacker@badsite.com', 
      ip: '51.75.144.10', 
      severity: 'critical',
      details: 'Attempted SQL injection attack' 
    }
  ];

  // Mock data for audit trail
  const auditTrail = [
    {
      id: '1',
      timestamp: '2025-04-16T09:12:34Z',
      action: 'Created new puzzle',
      user: 'category_manager@puzzleboss.com',
      details: 'Created MacBook Pro Ultimate Puzzle'
    },
    {
      id: '2',
      timestamp: '2025-04-16T08:55:21Z',
      action: 'Modified user role',
      user: 'superadmin@puzzleboss.com',
      details: 'Changed jane@example.com from Player to Social Media Manager'
    },
    {
      id: '3',
      timestamp: '2025-04-16T08:30:15Z',
      action: 'Changed prize value',
      user: 'admin@puzzleboss.com',
      details: 'Changed AirPods Pro Jigsaw prize value from $199 to $249'
    },
    {
      id: '4',
      timestamp: '2025-04-15T20:22:45Z',
      action: 'Verified puzzle',
      user: 'superadmin@puzzleboss.com',
      details: 'Verified iPhone 15 Puzzle Challenge for publication'
    },
    {
      id: '5',
      timestamp: '2025-04-15T18:15:33Z',
      action: 'Suspended user account',
      user: 'admin@puzzleboss.com',
      details: 'Suspended account for cheater@example.com due to rule violations'
    }
  ];

  // Mock data for compliance alerts
  const complianceAlerts = [
    {
      id: '1',
      timestamp: '2025-04-16T07:30:00Z',
      category: 'Prize Verification',
      status: 'pending',
      description: 'MacBook Pro prize requires verification documentation'
    },
    {
      id: '2',
      timestamp: '2025-04-15T22:15:45Z',
      category: 'Age Verification',
      status: 'resolved',
      description: 'Age verification process updated for international players'
    },
    {
      id: '3',
      timestamp: '2025-04-15T16:40:12Z',
      category: 'GDPR Compliance',
      status: 'active',
      description: 'Updated privacy policy requires review before May 1'
    },
    {
      id: '4',
      timestamp: '2025-04-14T10:25:33Z',
      category: 'Fair Play Monitoring',
      status: 'active',
      description: 'Unusual completion time pattern detected in Sneakers category'
    },
    {
      id: '5',
      timestamp: '2025-04-12T14:50:18Z',
      category: 'Payment Security',
      status: 'resolved',
      description: 'Quarterly PCI compliance audit completed successfully'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2" />
          Security Dashboard
        </CardTitle>
        <CardDescription>Monitor security events, audit trail, and compliance alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="logs">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Security Logs
            </TabsTrigger>
            <TabsTrigger value="audit">
              <GanttChart className="h-4 w-4 mr-2" />
              Audit Trail
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <AlertCircle className="h-4 w-4 mr-2" />
              Compliance Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search security logs..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{log.event.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            {log.user}
                          </div>
                        </TableCell>
                        <TableCell>{log.ip}</TableCell>
                        <TableCell>
                          <Badge className={
                            log.severity === 'critical' ? 'bg-red-600' :
                            log.severity === 'warning' ? 'bg-amber-500' :
                            'bg-blue-500'
                          }>
                            {log.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search audit trail..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditTrail.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            {entry.user}
                          </div>
                        </TableCell>
                        <TableCell>{entry.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search compliance alerts..." className="pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{alert.category}</TableCell>
                        <TableCell>
                          <Badge className={
                            alert.status === 'active' ? 'bg-amber-500' :
                            alert.status === 'pending' ? 'bg-blue-500' :
                            'bg-green-500'
                          }>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell className="text-right">
                          {alert.status !== 'resolved' && (
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
