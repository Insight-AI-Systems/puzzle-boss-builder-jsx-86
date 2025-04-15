
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type FormData = {
  title: string;
  priority: 'low' | 'medium' | 'high';
};

export function AddProgressItemDialog() {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase
      .from('progress_items')
      .insert([
        {
          title: data.title,
          priority: data.priority,
          status: 'pending'
        }
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding item",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Item added",
      description: "Your progress item has been added successfully.",
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-puzzle-black border-puzzle-aqua/20">
        <DialogHeader>
          <DialogTitle className="text-puzzle-white">Add New Progress Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-puzzle-white">Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-puzzle-black/30 border-puzzle-aqua/20 text-puzzle-white"
                      placeholder="Enter item title" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-puzzle-white">Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-puzzle-black/30 border-puzzle-aqua/20 text-puzzle-white">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-puzzle-black border-puzzle-aqua/20">
                      <SelectItem value="low" className="text-puzzle-white hover:bg-puzzle-aqua/10">Low</SelectItem>
                      <SelectItem value="medium" className="text-puzzle-white hover:bg-puzzle-aqua/10">Medium</SelectItem>
                      <SelectItem value="high" className="text-puzzle-white hover:bg-puzzle-aqua/10">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90">
                Add Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
