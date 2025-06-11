
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Shield } from 'lucide-react';

interface ProfilePaymentMethodsTabProps {
  userId: string;
}

export const ProfilePaymentMethodsTab: React.FC<ProfilePaymentMethodsTabProps> = ({ userId }) => {
  // Mock payment methods data
  const paymentMethods: any[] = [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No payment methods</h3>
              <p className="text-gray-500">Add a payment method to make purchases</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">**** **** **** {method.last_four}</p>
                      <p className="text-sm text-gray-500">{method.method_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={method.is_default ? 'default' : 'secondary'}>
                      {method.is_default ? 'Default' : 'Secondary'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Two-Factor Authentication</span>
            <Badge variant="secondary">Disabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Payment Notifications</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Secure Checkout</span>
            <Badge variant="default">Always</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
