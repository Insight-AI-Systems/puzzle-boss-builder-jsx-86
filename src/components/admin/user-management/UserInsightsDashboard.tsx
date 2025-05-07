
import { Card, CardContent } from "@/components/ui/card";
import { UserStats } from "@/types/adminTypes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserInsightsDashboardProps {
  userStats: UserStats;
  signupStats?: Array<{ month: string; count: number; }>;
}

export const UserInsightsDashboard: React.FC<UserInsightsDashboardProps> = ({ userStats, signupStats }) => {
  // Format gender data for pie chart
  const genderData = Object.entries(userStats.genderBreakdown || {}).map(([name, value]) => ({
    name,
    value
  }));

  // Format user types data for pie chart
  const userTypesData = [
    { name: 'Regular Users', value: userStats.regularCount || 0 },
    { name: 'Admins & Managers', value: userStats.adminCount || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">User Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Users Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="text-sm font-medium text-muted-foreground">Total Users</h4>
              <p className="text-2xl font-bold">{userStats.total}</p>
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Gender Distribution</h4>
            </div>
            <div className="h-[150px]">
              {genderData.length > 0 && genderData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No gender data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Types */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">User Types</h4>
            </div>
            <div className="h-[150px]">
              {userTypesData.some(item => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userTypesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userTypesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No user role data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signup Trends */}
      {signupStats && signupStats.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">Monthly Signups</h4>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signupStats}>
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const parts = value.split('-');
                      return `${parts[1]}/${parts[0].substring(2)}`;
                    }} 
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const parts = value.split('-');
                      const date = new Date(`${parts[0]}-${parts[1]}-01`);
                      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    }}
                    formatter={(value) => [`${value} users`, 'Signups']}
                  />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
