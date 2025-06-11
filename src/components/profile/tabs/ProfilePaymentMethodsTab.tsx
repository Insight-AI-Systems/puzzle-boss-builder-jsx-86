
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Star, Calendar, Shield } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_account';
  last_four?: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

interface ProfilePaymentMethodsTabProps {
  userId: string;
}

export function ProfilePaymentMethodsTab({ userId }: ProfilePaymentMethodsTabProps) {
  // Mock data - in real implementation, this would come from API
  const [paymentMethods] = React.useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit_card',
      last_four: '4242',
      brand: 'Visa',
      expiry_month: 12,
      expiry_year: 2025,
      is_default: true,
      is_active: true,
      created_at: '2023-01-15T00:00:00Z'
    },
    {
      id: '2',
      type: 'paypal',
      is_default: false,
      is_active: true,
      created_at: '2023-03-20T00:00:00Z'
    }
  ]);

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case 'credit_card':
        return `${method.brand} •••• ${method.last_four}`;
      case 'debit_card':
        return `${method.brand} •••• ${method.last_four}`;
      case 'paypal':
        return 'PayPal Account';
      case 'bank_account':
        return `Bank •••• ${method.last_four}`;
      default:
        return 'Payment Method';
    }
  };

  const handleAddPaymentMethod = () => {
    console.log('Add payment method');
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    console.log('Delete payment method:', methodId);
  };

  const handleSetDefault = (methodId: string) => {
    console.log('Set default payment method:', methodId);
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods List */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-puzzle-aqua" />
              Payment Methods
            </CardTitle>
            <Button 
              onClick={handleAddPaymentMethod}
              className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-puzzle-white/50 mx-auto mb-4" />
              <p className="text-puzzle-white/70">No payment methods added yet</p>
              <Button 
                onClick={handleAddPaymentMethod}
                className="mt-4 bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
              >
                Add Your First Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className="flex items-center justify-between p-4 border border-puzzle-aqua/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getPaymentMethodIcon(method.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-puzzle-white font-medium">
                          {getPaymentMethodLabel(method)}
                        </span>
                        {method.is_default && (
                          <Badge variant="secondary" className="bg-puzzle-gold/20 text-puzzle-gold">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      {method.expiry_month && method.expiry_year && (
                        <p className="text-puzzle-white/60 text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expires {method.expiry_month.toString().padStart(2, '0')}/{method.expiry_year}
                        </p>
                      )}
                      <p className="text-puzzle-white/50 text-xs">
                        Added {new Date(method.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <Button
                        onClick={() => handleSetDefault(method.id)}
                        variant="outline"
                        size="sm"
                        className="border-puzzle-aqua/30 text-puzzle-aqua hover:bg-puzzle-aqua/10"
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-puzzle-gold" />
            Payment Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-puzzle-white font-medium">Secure Payment Processing</p>
              <p className="text-puzzle-white/70 text-sm">
                All payment information is encrypted and processed securely through our certified payment partners.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-puzzle-white font-medium">PCI DSS Compliant</p>
              <p className="text-puzzle-white/70 text-sm">
                We maintain the highest security standards for handling payment card information.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-puzzle-white font-medium">No Stored Card Details</p>
              <p className="text-puzzle-white/70 text-sm">
                We don't store your full card numbers on our servers. Only encrypted tokens are kept for your convenience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
