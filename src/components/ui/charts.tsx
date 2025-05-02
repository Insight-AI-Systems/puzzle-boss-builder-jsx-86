
import React from 'react';
import {
  BarChart as ReChartsBarChart,
  Bar,
  LineChart as ReChartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as ReChartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface BarChartProps {
  data: any[];
  xAxis: string;
  yAxis: string;
  height?: number;
  colors?: string[];
}

export const BarChart = ({ 
  data, 
  xAxis, 
  yAxis, 
  height = 300, 
  colors = ['#0ea5e9']
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxis} fill={colors[0]} />
      </ReChartsBarChart>
    </ResponsiveContainer>
  );
};

interface LineChartProps {
  data: any[];
  xAxis: string;
  series: string[];
  height?: number;
  colors?: string[];
}

export const LineChart = ({ 
  data, 
  xAxis, 
  series, 
  height = 300, 
  colors = ['#0ea5e9', '#10b981', '#f59e0b'] 
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        {series.map((key, index) => (
          <Line 
            key={key} 
            type="monotone" 
            dataKey={key} 
            stroke={colors[index % colors.length]} 
            activeDot={{ r: 8 }} 
          />
        ))}
      </ReChartsLineChart>
    </ResponsiveContainer>
  );
};

interface PieChartProps {
  data: any[];
  height?: number;
  colors?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF'];

export const PieChart = ({ 
  data, 
  height = 300, 
  colors = COLORS 
}: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </ReChartsPieChart>
    </ResponsiveContainer>
  );
};
