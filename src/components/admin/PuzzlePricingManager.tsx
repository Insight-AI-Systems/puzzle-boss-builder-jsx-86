import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, Puzzle, Edit, Save, X } from 'lucide-react';

interface PuzzlePricing {
  id: string;
  difficulty_level: string;
  piece_count: number;
  base_price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function PuzzlePricingManager() {
  const [pricingOptions, setPricingOptions] = useState<PuzzlePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PuzzlePricing>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadPricingOptions();
  }, []);

  const loadPricingOptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('puzzle_game_pricing')
        .select('*')
        .order('piece_count', { ascending: true });

      if (error) throw error;
      setPricingOptions(data || []);
    } catch (error) {
      console.error('Error loading pricing options:', error);
      toast({
        title: "Error",
        description: "Failed to load puzzle pricing options",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (option: PuzzlePricing) => {
    setEditingId(option.id);
    setEditForm({ ...option });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.base_price) return;

    try {
      const { error } = await supabase
        .from('puzzle_game_pricing')
        .update({
          base_price: editForm.base_price,
          is_active: editForm.is_active
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });

      setEditingId(null);
      setEditForm({});
      loadPricingOptions();
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to update pricing",
        variant: "destructive",
      });
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Puzzle Game Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading pricing options...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Puzzle Game Pricing
        </CardTitle>
        <CardDescription>
          Manage pricing for different puzzle difficulty levels and piece counts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pricingOptions.map((option) => (
            <div key={option.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
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
                  <Badge variant={option.is_active ? "default" : "secondary"}>
                    {option.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  {editingId === option.id ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`price-${option.id}`} className="text-sm">$</Label>
                        <Input
                          id={`price-${option.id}`}
                          type="number"
                          step="0.01"
                          value={editForm.base_price || ''}
                          onChange={(e) => setEditForm({ ...editForm, base_price: parseFloat(e.target.value) })}
                          className="w-20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editForm.is_active || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                        />
                        <Label className="text-sm">Active</Label>
                      </div>
                      <Button size="sm" variant="outline" onClick={saveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold">
                        {formatPrice(option.base_price, option.currency)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(option)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}