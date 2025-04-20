
import * as z from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  company: z.string().min(1, { message: 'Company name is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
  interest: z.string().min(1, { message: 'Please select a partnership interest' }),
  budget: z.string().min(1, { message: 'Please select a budget range' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export type FormData = z.infer<typeof formSchema>;
