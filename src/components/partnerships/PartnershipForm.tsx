
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandshakeIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormData } from './validation/partnershipSchema';
import PersonalInfoFields from './sections/PersonalInfoFields';
import PartnershipFields from './sections/PartnershipFields';
import FormStatus from './FormStatus';
import { usePartnershipForm } from '@/hooks/usePartnershipForm';

const PartnershipForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      position: '',
      interest: '',
      budget: '',
      message: '',
    },
  });

  const { handleSubmit, isSubmitting, formError, formSuccess } = usePartnershipForm();

  const onSubmit = async (values: FormData) => {
    const success = await handleSubmit(values);
    if (success) {
      form.reset();
    }
  };

  return (
    <Card className="border-puzzle-aqua/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HandshakeIcon className="h-5 w-5 mr-2 text-puzzle-aqua" />
          Partner with Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormStatus error={formError} success={formSuccess} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoFields form={form} />
            <PartnershipFields form={form} />
            
            <Button 
              type="submit"
              className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Partnership Inquiry'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PartnershipForm;
