
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export function FinanceStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">$24,492</h3>
            <div className="text-sm text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+4.3%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Expenses</p>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">$8,954</h3>
            <div className="text-sm text-red-500 flex items-center">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span>+2.1%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">$15,538</h3>
            <div className="text-sm text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5.4%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">2,843</h3>
            <div className="text-sm text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
