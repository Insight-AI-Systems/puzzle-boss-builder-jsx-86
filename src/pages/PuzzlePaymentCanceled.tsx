import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, CreditCard, ArrowLeft } from 'lucide-react';

export default function PuzzlePaymentCanceled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Payment Canceled</CardTitle>
          <CardDescription>
            Your payment was canceled and no charges were made to your account.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Information */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">What happened?</h4>
            <p className="text-sm text-muted-foreground">
              You chose to cancel the payment process before it was completed. 
              No puzzle game access was granted and your payment method was not charged.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate(-1)} 
              className="w-full" 
              size="lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Additional Options */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Need help with payment options?
            </p>
            <Button variant="link" size="sm">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}