
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '../validation/partnershipSchema';

interface PartnershipFieldsProps {
  form: UseFormReturn<FormData>;
}

const PartnershipFields: React.FC<PartnershipFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="interest"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Partnership Interest</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your partnership interest" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="prize">Prize Sponsorship</SelectItem>
                <SelectItem value="branded">Branded Puzzles</SelectItem>
                <SelectItem value="category">Category Sponsorship</SelectItem>
                <SelectItem value="promotional">Promotional Events</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Budget Range</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-5k">$0 - $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                <SelectItem value="50k+">$50,000+</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Partnership Details</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Please describe your partnership proposal or inquiry..."
                rows={5}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PartnershipFields;
