
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePartnerManagement, PartnerAgreement } from '@/hooks/admin/usePartnerManagement';
import { FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(1, "Agreement name is required"),
  version: z.string().min(1, "Version is required"),
  status: z.string().min(1, "Status is required"),
  document_url: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  effective_from: z.string().optional(),
  effective_to: z.string().optional(),
});

interface AgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
  editAgreement?: PartnerAgreement | null;
  partnerName?: string;
}

const AgreementDialog: React.FC<AgreementDialogProps> = ({ 
  open, 
  onOpenChange,
  partnerId,
  editAgreement,
  partnerName
}) => {
  const { createAgreement, updateAgreement } = usePartnerManagement(partnerId);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editAgreement ? {
      name: editAgreement.name,
      version: editAgreement.version,
      status: editAgreement.status,
      document_url: editAgreement.document_url || '',
      effective_from: editAgreement.effective_from 
        ? format(new Date(editAgreement.effective_from), 'yyyy-MM-dd')
        : undefined,
      effective_to: editAgreement.effective_to
        ? format(new Date(editAgreement.effective_to), 'yyyy-MM-dd')
        : undefined,
    } : {
      name: `${partnerName ? `${partnerName} - ` : ''}Partnership Agreement`,
      version: '1.0',
      status: 'pending',
      document_url: '',
      effective_from: undefined,
      effective_to: undefined,
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const agreementData = {
      partner_id: partnerId,
      name: data.name,
      version: data.version,
      status: data.status,
      document_url: data.document_url || null,
      effective_from: data.effective_from || null,
      effective_to: data.effective_to || null,
      signed_at: data.status === 'signed' || data.status === 'active' ? new Date().toISOString() : null,
    };
    
    if (editAgreement) {
      updateAgreement(editAgreement.id, agreementData);
    } else {
      createAgreement(agreementData);
    }
    
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editAgreement ? 'Edit Agreement' : 'Add New Agreement'}
          </DialogTitle>
          <DialogDescription>
            {editAgreement 
              ? 'Update the agreement details below.' 
              : `Create a new agreement for ${partnerName || 'this partner'}.`}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreement Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="signed">Signed</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://docs.example.com/agreement.pdf" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effective_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective From</FormLabel>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="effective_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective To</FormLabel>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editAgreement ? 'Update Agreement' : 'Create Agreement'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementDialog;
