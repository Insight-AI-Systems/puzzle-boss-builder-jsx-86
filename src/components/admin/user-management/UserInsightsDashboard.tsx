
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStats, MonthlySignupData } from '@/types/adminTypes';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Users, UserPlus, Activity } from 'lucide-react';

interface UserInsightsDashboardProps {
  stats: UserStats;
  signupStats: MonthlySignupData[];
}

export function UserInsightsDashboard({ stats, signupStats }: UserInsightsDashboardProps) {
  // Prepare data for pie chart
  const genderData = Object.entries(stats.genderBreakdown || {}).map(([name, value]) => ({
    name: formatGenderName(name),
    value
  }));

  // Age breakdown data
  const ageData = Object.entries(stats.ageBreakdown || {}).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Format the month names for the signup chart
  const formattedSignupStats = signupStats.map(item => ({
    ...item,
    month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.total} 
          icon={<Users className="h-6 w-6 text-puzzle-aqua" />} 
        />

        <Card className="flex-1 flex flex-col md:flex-row gap-2 p-4">
          <div className="text-lg font-medium mb-2">Gender Distribution</div>
          <div className="flex flex-wrap gap-2">
            {genderData.map((item, index) => (
              <div key={item.name} className="bg-muted rounded-full px-3 py-1 text-sm flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span>{item.name}: </span>
                <span className="font-bold ml-1">{String(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        {ageData.length > 0 && (
          <Card className="flex-1 flex flex-col md:flex-row gap-2 p-4">
            <div className="text-lg font-medium mb-2">Age Distribution</div>
            <div className="flex flex-wrap gap-2">
              {ageData.map((item, index) => (
                <div key={item.name} className="bg-muted rounded-full px-3 py-1 text-sm flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{item.name}: </span>
                  <span className="font-bold ml-1">{String(item.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Tabs defaultValue="signups" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="signups" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> New Signups
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Demographics
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Engagement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signups" className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">New Members per Month</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedSignupStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0088FE" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="border rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Gender Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {ageData.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Age Group Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="border rounded-md p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="mb-4 text-xl font-medium">Coming Soon</div>
              <p>Puzzle completion stats and user engagement metrics will be available here.</p>
              <p className="text-sm text-muted-foreground mt-2">This requires additional event tracking setup.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="bg-gradient-to-tr from-muted/50 to-muted/10 p-4 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h4 className="text-3xl font-bold mt-1">{value.toLocaleString()}</h4>
        </div>
        <div className="p-2 bg-muted/30 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Helper to format gender names for display
function formatGenderName(gender: string): string {
  switch (gender) {
    case 'male': return 'Male';
    case 'female': return 'Female';
    case 'non-binary': return 'Non-binary';
    case 'prefer-not-to-say': return 'Prefer not to say';
    case 'custom': return 'Custom';
    case 'null': return 'Not specified';
    default: return gender;
  }
}
