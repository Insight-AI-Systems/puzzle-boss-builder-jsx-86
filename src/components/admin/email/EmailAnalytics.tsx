
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Download } from "lucide-react";
import { useEmailAnalytics } from "@/hooks/admin/useEmailAnalytics";
import { format } from "date-fns";

export const EmailAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [campaign, setCampaign] = useState<string>("all");
  
  const {
    deliveryStats,
    engagementStats,
    clickRates,
    campaignsList,
    isLoading,
    error,
    exportData
  } = useEmailAnalytics(dateRange, campaign);
  
  const handleExportData = () => {
    exportData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Email Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Track email performance and engagement metrics
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            align="end"
          />
          <Select value={campaign} onValueChange={setCampaign}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaignsList.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error instanceof Error ? error.message : "An error occurred while loading analytics"}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{deliveryStats.deliveryRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {deliveryStats.delivered} delivered out of {deliveryStats.sent} sent
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{deliveryStats.openRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {deliveryStats.opened} opened out of {deliveryStats.delivered} delivered
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{deliveryStats.clickRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {deliveryStats.clicked} clicks out of {deliveryStats.opened} opened
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="engagement" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="clicks">Click Analytics</TabsTrigger>
              <TabsTrigger value="devices">Devices & Platforms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="engagement">
              <Card>
                <CardHeader>
                  <CardTitle>Email Engagement Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart
                    data={engagementStats}
                    xAxis="date"
                    series={['sent', 'opened', 'clicked']}
                    colors={['#94a3b8', '#0ea5e9', '#10b981']}
                    height={300}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clicks">
              <Card>
                <CardHeader>
                  <CardTitle>Link Click Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={clickRates}
                    xAxis="link"
                    yAxis="clicks"
                    height={300}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices">
              <Card>
                <CardHeader>
                  <CardTitle>Email Client Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-[300px] h-[300px]">
                    <PieChart 
                      data={[
                        { name: "Mobile", value: deliveryStats.mobilePct },
                        { name: "Desktop", value: deliveryStats.desktopPct },
                        { name: "Webmail", value: deliveryStats.webmailPct },
                        { name: "Other", value: deliveryStats.otherPct }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
