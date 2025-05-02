
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, RefreshCcw } from "lucide-react";

export const SitemapGenerator: React.FC = () => {
  const { toast } = useToast();
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [lastGenerated, setLastGenerated] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const pages = [
    { id: 'home', url: '/', priority: 1.0, changeFreq: 'weekly', included: true },
    { id: 'puzzles', url: '/puzzles', priority: 0.9, changeFreq: 'daily', included: true },
    { id: 'prizes', url: '/prizes-won', priority: 0.8, changeFreq: 'daily', included: true },
    { id: 'about', url: '/about', priority: 0.7, changeFreq: 'monthly', included: true },
    { id: 'faq', url: '/faq', priority: 0.7, changeFreq: 'monthly', included: true },
    { id: 'contact', url: '/contact', priority: 0.6, changeFreq: 'monthly', included: true },
    { id: 'terms', url: '/terms', priority: 0.5, changeFreq: 'yearly', included: true },
    { id: 'privacy', url: '/privacy', priority: 0.5, changeFreq: 'yearly', included: true },
  ];
  
  const [pageSettings, setPageSettings] = useState(pages);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setLastGenerated(new Date().toLocaleString());
      
      toast({
        title: "Sitemap Generated",
        description: "sitemap.xml has been successfully generated and placed in the root directory.",
      });
    }, 1500);
  };
  
  const handleSubmit = () => {
    toast({
      title: "Sitemap Submitted",
      description: "Sitemap has been submitted to search engines (Google, Bing).",
    });
  };
  
  const updatePageSetting = (id: string, field: string, value: any) => {
    setPageSettings(pageSettings.map(page => 
      page.id === id ? { ...page, [field]: value } : page
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Sitemap Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Control how search engines index your site
          </p>
        </div>
        <div>
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : 'Generate Sitemap'}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-generate">Automatic Generation</Label>
                <p className="text-sm text-muted-foreground">
                  Generate sitemap.xml automatically when content changes
                </p>
              </div>
              <Switch 
                id="auto-generate" 
                checked={autoGenerate} 
                onCheckedChange={setAutoGenerate}
              />
            </div>
            
            {lastGenerated && (
              <p className="text-sm text-muted-foreground">
                Last generated: {lastGenerated}
              </p>
            )}
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="text-sm font-medium mb-4">Pages to include in sitemap</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Include</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Change Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageSettings.map(page => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <Checkbox 
                            checked={page.included} 
                            onCheckedChange={(checked) => 
                              updatePageSetting(page.id, 'included', !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell>{page.url}</TableCell>
                        <TableCell className="w-[200px]">
                          <div className="flex items-center gap-2">
                            <Slider 
                              value={[page.priority * 100]} 
                              min={0} 
                              max={100}
                              step={10}
                              onValueChange={(value) => 
                                updatePageSetting(page.id, 'priority', value[0] / 100)
                              }
                              className="w-[100px]"
                            />
                            <span className="w-10 text-xs">{page.priority.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={page.changeFreq} 
                            onValueChange={(value) => 
                              updatePageSetting(page.id, 'changeFreq', value)
                            }
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Submit to Search Engines</h4>
              <div className="flex space-x-2">
                <Button onClick={handleSubmit} variant="outline" className="flex items-center">
                  Submit to Google
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={handleSubmit} variant="outline" className="flex items-center">
                  Submit to Bing
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
