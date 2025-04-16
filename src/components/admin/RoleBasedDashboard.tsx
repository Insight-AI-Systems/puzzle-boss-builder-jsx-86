
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  UserCog, ShieldAlert, LayoutDashboard, Users, 
  ImageIcon, ShoppingCart, Settings, BarChart,
  FileText, Puzzle, Star, Mail, Eye, Bell, Lock
} from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserManagement } from './UserManagement';
import { GameManagement } from './GameManagement';
import { ContentManagement } from './ContentManagement';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { SecurityDashboard } from './SecurityDashboard';
import { EmailManagement } from './EmailManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';

// Category Management Component
const CategoryManagement: React.FC = () => (
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

// Marketing Dashboard Component
const MarketingDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Marketing Dashboard</CardTitle>
      <CardDescription>Social media and promotion management</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows social media managers to schedule promotions and track marketing metrics.</p>
    </CardContent>
  </Card>
);

// Partners Dashboard Component
const PartnersDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Partners Dashboard</CardTitle>
      <CardDescription>Manage prize suppliers and partnerships</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows partner managers to handle supplier relationships and prize data.</p>
    </CardContent>
  </Card>
);

// Financial Dashboard Component
const FinancialDashboard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Financial Dashboard</CardTitle>
      <CardDescription>Revenue tracking and financial reports</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">This section allows CFO users to access financial reporting and analytics.</p>
    </CardContent>
  </Card>
);

interface TabDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  roles: UserRole[];
}

export const RoleBasedDashboard: React.FC = () => {
  const { profile } = useUserProfile();
  
  if (!profile) return null;
  
  const userRole = profile.role;
  
  // Define tabs with role permissions
  const tabs: TabDefinition[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Welcome to the admin dashboard, {profile.display_name || 'Admin'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-puzzle-aqua/10 border-puzzle-aqua">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Role: {ROLE_DEFINITIONS[userRole].label}</AlertTitle>
              <AlertDescription>
                {ROLE_DEFINITIONS[userRole].description}
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground">
              Your role gives you access to specific sections of the admin dashboard.
              Use the tabs above to navigate to different sections.
            </p>
          </CardContent>
        </Card>
      ),
      roles: ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo']
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      component: <AnalyticsDashboard />,
      roles: ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo']
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users className="h-4 w-4 mr-2" />,
      component: <UserManagement />,
      roles: ['super_admin', 'admin']
    },
    {
      id: "puzzles",
      label: "Puzzles",
      icon: <Puzzle className="h-4 w-4 mr-2" />,
      component: <GameManagement />,
      roles: ['super_admin', 'admin', 'category_manager']
    },
    {
      id: "categories",
      label: "Categories",
      icon: <ImageIcon className="h-4 w-4 mr-2" />,
      component: <CategoryManagement />,
      roles: ['super_admin', 'admin', 'category_manager']
    },
    {
      id: "content",
      label: "Content",
      icon: <FileText className="h-4 w-4 mr-2" />,
      component: <ContentManagement />,
      roles: ['super_admin', 'admin', 'social_media_manager']
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: <Star className="h-4 w-4 mr-2" />,
      component: <MarketingDashboard />,
      roles: ['super_admin', 'admin', 'social_media_manager']
    },
    {
      id: "partners",
      label: "Partners",
      icon: <ShoppingCart className="h-4 w-4 mr-2" />,
      component: <PartnersDashboard />,
      roles: ['super_admin', 'admin', 'partner_manager']
    },
    {
      id: "finance",
      label: "Finance",
      icon: <Settings className="h-4 w-4 mr-2" />,
      component: <FinancialDashboard />,
      roles: ['super_admin', 'admin', 'cfo']
    },
    {
      id: "security",
      label: "Security",
      icon: <Lock className="h-4 w-4 mr-2" />,
      component: <SecurityDashboard />,
      roles: ['super_admin']
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail className="h-4 w-4 mr-2" />,
      component: <EmailManagement />,
      roles: ['super_admin', 'admin']
    },
    {
      id: "monitoring",
      label: "Monitoring",
      icon: <Eye className="h-4 w-4 mr-2" />,
      component: (
        <Card>
          <CardHeader>
            <CardTitle>System Monitoring</CardTitle>
            <CardDescription>Real-time monitoring and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This section provides real-time monitoring of system activity and alerts.</p>
          </CardContent>
        </Card>
      ),
      roles: ['super_admin']
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4 mr-2" />,
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Notification Management</CardTitle>
            <CardDescription>Manage system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This section allows control of system-wide notifications and alerts.</p>
          </CardContent>
        </Card>
      ),
      roles: ['super_admin', 'admin']
    }
  ];
  
  // Filter tabs based on user role
  const accessibleTabs = tabs.filter(tab => tab.roles.includes(userRole as UserRole));

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20 mb-6 flex flex-wrap">
        {accessibleTabs.map(tab => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id} 
            className="data-[state=active]:bg-puzzle-aqua/10"
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {accessibleTabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className="pt-4">
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};
