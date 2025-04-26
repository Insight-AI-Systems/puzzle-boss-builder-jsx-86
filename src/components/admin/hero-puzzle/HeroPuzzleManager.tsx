
import React, { useState, useCallback } from 'react';
import { HeroPuzzleConfig } from '@/hooks/useHeroPuzzle';
import { HeroPuzzleForm } from './HeroPuzzleForm';
import { HeroPuzzleFooter } from './HeroPuzzleFooter';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const HeroPuzzleManager: React.FC = () => {
  const [formData, setFormData] = useState<Partial<HeroPuzzleConfig>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hero_puzzle_config')
        .select('*')
        .single();

      if (error) {
        console.log("No hero puzzle config found, creating a new one");
        setFormData({});
        return;
      }

      setFormData(data || {});
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: "Failed to load hero puzzle configuration.",
        variant: "destructive",
      });
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormUpdate = (updates: Partial<HeroPuzzleConfig>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { id, ...rest } = formData;

      if (id) {
        // Update existing record
        const { data, error } = await supabase
          .from('hero_puzzle_config')
          .update(rest)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setFormData(data);
        toast({
          title: "Success",
          description: "Hero puzzle configuration updated successfully.",
        });
      } else {
        // Create a new record - make sure image_url is provided
        if (!formData.image_url) {
          throw new Error("Image URL is required");
        }

        const { data, error } = await supabase
          .from('hero_puzzle_config')
          .insert([{ 
            ...rest,
            image_url: formData.image_url,
            title: formData.title || 'Welcome Puzzle',
            difficulty: formData.difficulty || 'medium'
          }])
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setFormData(data);
        toast({
          title: "Success",
          description: "Hero puzzle configuration created successfully.",
        });
      }
    } catch (error: any) {
      console.error("Error updating record:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update hero puzzle configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchData();
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      if (!formData.id) {
        throw new Error("No ID provided for deletion.");
      }

      const { error } = await supabase
        .from('hero_puzzle_config')
        .delete()
        .eq('id', formData.id);

      if (error) {
        throw new Error(error.message);
      }

      setFormData({});
      toast({
        title: "Success",
        description: "Hero puzzle configuration deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting record:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete hero puzzle configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      fetchData();
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <HeroPuzzleForm formData={formData} onFormUpdate={handleFormUpdate} />
          <HeroPuzzleFooter 
            formData={formData}
            isSubmitting={isSubmitting}
            onDelete={handleDelete}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default HeroPuzzleManager;
