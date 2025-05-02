
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterIcon, Users, Save, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUserSegmentation } from "@/hooks/admin/useUserSegmentation";

export const EmailSegmentation: React.FC = () => {
  const { toast } = useToast();
  const [segmentName, setSegmentName] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const {
    countryFilter,
    ageFilter, 
    genderFilter,
    categoryFilter,
    prizeFilter,
    userCount,
    updateCountryFilter,
    updateAgeFilter,
    updateGenderFilter,
    updateCategoryFilter,
    updatePrizeFilter,
    saveSegment,
    sendToSegment,
    loadingUserCount,
    isLoadingOperation
  } = useUserSegmentation();

  const handleAddFilter = (filter: string) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const handleSaveSegment = async () => {
    if (!segmentName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for this segment",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await saveSegment(segmentName);
      toast({
        title: "Success",
        description: "User segment saved successfully",
      });
      setSegmentName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user segment",
        variant: "destructive",
      });
    }
  };

  const handleSendToSegment = () => {
    sendToSegment();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Segmentation</h3>
          <p className="text-sm text-muted-foreground">
            Create targeted user segments for your email campaigns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-muted px-3 py-1 rounded-md flex items-center gap-1 min-w-[110px]">
            <Users className="h-4 w-4 text-muted-foreground" />
            {loadingUserCount ? (
              <span className="text-sm">Loading...</span>
            ) : (
              <span className="text-sm">{userCount} users</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedFilters.includes("country") ? "default" : "outline"} 
          size="sm" 
          onClick={() => selectedFilters.includes("country") ? handleRemoveFilter("country") : handleAddFilter("country")}
        >
          Country
        </Button>
        <Button 
          variant={selectedFilters.includes("age") ? "default" : "outline"} 
          size="sm" 
          onClick={() => selectedFilters.includes("age") ? handleRemoveFilter("age") : handleAddFilter("age")}
        >
          Age
        </Button>
        <Button 
          variant={selectedFilters.includes("gender") ? "default" : "outline"} 
          size="sm" 
          onClick={() => selectedFilters.includes("gender") ? handleRemoveFilter("gender") : handleAddFilter("gender")}
        >
          Gender
        </Button>
        <Button 
          variant={selectedFilters.includes("category") ? "default" : "outline"} 
          size="sm" 
          onClick={() => selectedFilters.includes("category") ? handleRemoveFilter("category") : handleAddFilter("category")}
        >
          Category
        </Button>
        <Button 
          variant={selectedFilters.includes("prize") ? "default" : "outline"} 
          size="sm" 
          onClick={() => selectedFilters.includes("prize") ? handleRemoveFilter("prize") : handleAddFilter("prize")}
        >
          Prize Winners
        </Button>
      </div>

      {selectedFilters.includes("country") && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FilterIcon className="h-4 w-4 mr-2" />
              Country Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <Select value={countryFilter} onValueChange={updateCountryFilter}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {selectedFilters.includes("age") && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FilterIcon className="h-4 w-4 mr-2" />
              Age Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Age Range: {ageFilter[0]} - {ageFilter[1]}</span>
                </div>
                <Slider 
                  defaultValue={ageFilter} 
                  max={100} 
                  min={13} 
                  step={1}
                  onValueChange={updateAgeFilter}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFilters.includes("gender") && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FilterIcon className="h-4 w-4 mr-2" />
              Gender Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <Checkbox 
                  checked={genderFilter.includes('male')} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateGenderFilter([...genderFilter, 'male']);
                    } else {
                      updateGenderFilter(genderFilter.filter(g => g !== 'male'));
                    }
                  }}
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox 
                  checked={genderFilter.includes('female')} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateGenderFilter([...genderFilter, 'female']);
                    } else {
                      updateGenderFilter(genderFilter.filter(g => g !== 'female'));
                    }
                  }}
                />
                <span>Female</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox 
                  checked={genderFilter.includes('other')} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateGenderFilter([...genderFilter, 'other']);
                    } else {
                      updateGenderFilter(genderFilter.filter(g => g !== 'other'));
                    }
                  }}
                />
                <span>Other</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox 
                  checked={genderFilter.includes('not_specified')} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateGenderFilter([...genderFilter, 'not_specified']);
                    } else {
                      updateGenderFilter(genderFilter.filter(g => g !== 'not_specified'));
                    }
                  }}
                />
                <span>Not Specified</span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFilters.includes("category") && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FilterIcon className="h-4 w-4 mr-2" />
              Category Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <Select value={categoryFilter} onValueChange={updateCategoryFilter}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select puzzle category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="animals">Animals</SelectItem>
                <SelectItem value="landscapes">Landscapes</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="abstract">Abstract</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {selectedFilters.includes("prize") && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FilterIcon className="h-4 w-4 mr-2" />
              Prize Winners Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <Select value={prizeFilter} onValueChange={updatePrizeFilter}>
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select prize filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="winners">Only Prize Winners</SelectItem>
                <SelectItem value="non_winners">Never Won Prizes</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Enter segment name to save" 
            className="w-64" 
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />
          <Button onClick={handleSaveSegment} disabled={isLoadingOperation || !segmentName.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Segment
          </Button>
        </div>
        <Button onClick={handleSendToSegment} disabled={isLoadingOperation || userCount === 0}>
          <Mail className="h-4 w-4 mr-2" />
          Send Email to Segment
        </Button>
      </div>
    </div>
  );
};
