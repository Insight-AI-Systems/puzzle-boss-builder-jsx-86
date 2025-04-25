
import * as z from 'zod';

export const ticketFormSchema = z.object({
  title: z.string()
    .min(5, { message: 'Title must be at least 5 characters.' })
    .max(100, { message: 'Title must be less than 100 characters.' }),
  departmentId: z.string()
    .refine(val => !!val, { message: "Please select a department" }),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  content: z.string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
