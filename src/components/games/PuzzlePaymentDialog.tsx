import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Clock, Puzzle } from 'lucide-react';
import { usePuzzlePayment } from '@/hooks/usePuzzlePayment';

interface PuzzlePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puzzleImageId: string;
  puzzleImageUrl?: string;
  puzzleName?: string;
  onPaymentSuccess?: () => void;
}

interface PuzzlePricing {
  id: string;
  difficulty_level: string;
  piece_count: number;
  base_price: number;
  currency: string;
}

export function PuzzlePaymentDialog({
  open,
  onOpenChange,
  puzzleImageId,
  puzzleImageUrl,
  puzzleName = "Puzzle Game",
  onPaymentSuccess
}: PuzzlePaymentDialogProps) {
  const { startPuzzlePayment, getPuzzlePricing, isProcessing } = usePuzzlePayment();
  const [pricingOptions, setPricingOptions] = useState<PuzzlePricing[]>([]);
  const [selectedOption, setSelectedOption] = useState<PuzzlePricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);

  useEffect(() => {
    if (open) {
      loadPricingOptions();
    }
  }, [open]);

  const loadPricingOptions = async () => {
    setLoadingPricing(true);
    try {
      const pricing = await getPuzzlePricing();
      setPricingOptions(pricing);
      if (pricing.length > 0) {
        setSelectedOption(pricing[0]); // Default to first option
      }
    } catch (error) {
      console.error('Error loading pricing:', error);
    } finally {
      setLoadingPricing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedOption) return;

    const result = await startPuzzlePayment(
      puzzleImageId,
      selectedOption.difficulty_level,
      selectedOption.piece_count
    );

    if (result.success) {
      onOpenChange(false);
      onPaymentSuccess?.();
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Purchase Puzzle Game Access
          </DialogTitle>
          <DialogDescription>
            Choose your difficulty level and complete your purchase to start playing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Puzzle Preview */}
          {puzzleImageUrl && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <img
                  src={puzzleImageUrl}
                  alt={puzzleName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{puzzleName}</h4>
                <p className="text-sm text-muted-foreground">
                  Select your preferred difficulty level
                </p>
              </div>
            </div>
          )}

          {/* Pricing Options */}
          {loadingPricing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading pricing options...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium">Select Difficulty & Price</h4>
              {pricingOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOption?.id === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(option.difficulty_level)}
                      >
                        {option.difficulty_level.charAt(0).toUpperCase() + option.difficulty_level.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Puzzle className="h-4 w-4" />
                        {option.piece_count} pieces
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatPrice(option.base_price, option.currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Summary */}
          {selectedOption && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total:</span>
                <span className="text-lg font-bold">
                  {formatPrice(selectedOption.base_price, selectedOption.currency)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                One-time payment for unlimited puzzle access
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!selectedOption || isProcessing || loadingPricing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay & Play
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}