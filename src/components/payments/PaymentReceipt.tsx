
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Download, 
  CheckCircle,
  Calendar,
  DollarSign,
  Hash
} from 'lucide-react';
import { TransactionReceipt } from '@/types/payments';

interface PaymentReceiptProps {
  receipt: TransactionReceipt;
  onDownload?: () => void;
  onClose?: () => void;
}

export function PaymentReceipt({ receipt, onDownload, onClose }: PaymentReceiptProps) {
  const receiptData = receipt.receipt_data as any;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white text-black print:shadow-none">
      <CardHeader className="text-center border-b">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <CardTitle className="text-green-600">Payment Successful</CardTitle>
        </div>
        <div className="text-sm text-gray-600">
          Receipt #{receipt.receipt_number}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Transaction Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Transaction ID</span>
            </div>
            <span className="text-sm font-mono">{receipt.transaction_id.slice(-8)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Date</span>
            </div>
            <span className="text-sm">
              {new Date(receipt.created_at).toLocaleDateString()} {new Date(receipt.created_at).toLocaleTimeString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Amount</span>
            </div>
            <span className="text-lg font-bold">${receipt.amount.toFixed(2)} {receipt.currency}</span>
          </div>

          {receipt.description && (
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Description</span>
              </div>
              <span className="text-sm text-right max-w-48">{receipt.description}</span>
            </div>
          )}

          {receiptData?.game_id && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Game ID</span>
              <span className="text-sm font-mono">{receiptData.game_id.slice(-8)}</span>
            </div>
          )}

          {receiptData?.transaction_type && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type</span>
              <Badge variant="outline" className="capitalize">
                {receiptData.transaction_type.replace('_', ' ')}
              </Badge>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Thank you for playing PuzzleBoss!</p>
          <p>Questions? Contact support@puzzleboss.com</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 print:hidden">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Print
          </Button>
          {onClose && (
            <Button
              onClick={onClose}
              className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black"
            >
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
