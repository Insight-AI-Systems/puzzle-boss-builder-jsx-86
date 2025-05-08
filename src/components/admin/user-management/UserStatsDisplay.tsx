
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { UserStatsDisplayProps } from '@/types/userTableTypes';
import { Shield, User, Clock } from 'lucide-react';

export function UserStatsDisplay({ stats }: UserStatsDisplayProps) {
  // Format role data for chart
  const roleData = stats.roleCounts ? 
    Object.entries(stats.roleCounts).map(([role, count]) => ({
      name: formatRoleName(role),
      value: count
    })) : [];
  
  // Format signup data
  const signupData = stats.signupsByPeriod || [];
  
  // Colors for charts
  const ROLE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#8884D8'];
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Key metrics */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-md border border-muted">
              <User className="h-8 w-8 mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.regularCount}</div>
              <div className="text-xs text-muted-foreground">Regular Users</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-md border border-muted">
              <Shield className="h-8 w-8 mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{stats.adminCount}</div>
              <div className="text-xs text-muted-foreground">Admins</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-md border border-muted">
              <Clock className="h-8 w-8 mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.activeUsers || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
          </div>
          
          {/* Role distribution chart */}
          {roleData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">User Role Distribution</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {roleData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={ROLE_COLORS[index % ROLE_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* User signups chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-2">New User Signups</h3>
          {signupData.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} users`, 'New signups']} />
                  <Bar dataKey="count" name="New Users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">No signup data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to format role names for display
function formatRoleName(role: string): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'category_manager':
      return 'Category Mgr';
    case 'social_media_manager':
      return 'Social Media';
    case 'partner_manager':
      return 'Partner Mgr';
    case 'player':
      return 'Player';
    case 'cfo':
      return 'CFO';
    default:
      return role;
  }
}
