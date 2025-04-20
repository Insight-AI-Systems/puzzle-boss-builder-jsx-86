
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const ticketSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  status: z.boolean().default(false)
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  onSubmit: (values: { heading: string; description: string; status: 'WIP' | 'Completed' }) => void;
  defaultValues?: Partial<TicketFormValues>;
  isSubmitting?: boolean;
}

export function TicketForm({ onSubmit, defaultValues, isSubmitting }: TicketFormProps) {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      heading: defaultValues?.heading || "",
      description: defaultValues?.description || "",
      status: defaultValues?.status || false
    }
  });

  const handleSubmit = (values: TicketFormValues) => {
    onSubmit({
      heading: values.heading,
      description: values.description,
      status: values.status ? 'Completed' : 'WIP'
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="heading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heading</FormLabel>
              <FormControl>
                <Input placeholder="Ticket heading..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Ticket description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Completed</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Ticket"}
        </Button>
      </form>
    </Form>
  );
}
