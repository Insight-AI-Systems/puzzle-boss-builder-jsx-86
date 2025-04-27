
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { HeroPuzzleConfig } from '@/hooks/useHeroPuzzle';

interface HeroPuzzleFormProps {
  formData: Partial<HeroPuzzleConfig>;
  onFormUpdate?: (updates: Partial<HeroPuzzleConfig>) => void;
  handleChange?: (key: keyof HeroPuzzleConfig, value: string) => void;
  onImageSelectorOpen?: () => void;
}

export const HeroPuzzleForm: React.FC<HeroPuzzleFormProps> = ({
  formData,
  onFormUpdate,
  handleChange,
  onImageSelectorOpen,
}) => {
  // Handle prop compatibility between the two implementations
  const onChangeValue = (key: keyof HeroPuzzleConfig, value: string) => {
    if (handleChange) {
      handleChange(key, value);
    } else if (onFormUpdate) {
      onFormUpdate({ [key]: value });
    }
  };

  const handleImageSelector = () => {
    if (onImageSelectorOpen) {
      onImageSelectorOpen();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Puzzle Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => onChangeValue('title', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChangeValue('description', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={formData.difficulty}
          onValueChange={(value) => onChangeValue('difficulty', value as 'easy' | 'medium' | 'hard')}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy (3x3)</SelectItem>
            <SelectItem value="medium">Medium (4x4)</SelectItem>
            <SelectItem value="hard">Hard (5x5)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <div className="flex space-x-2">
          <Input
            id="image_url"
            value={formData.image_url || ''}
            onChange={(e) => onChangeValue('image_url', e.target.value)}
            required
          />
          {onImageSelectorOpen && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              title="Browse image library"
              onClick={handleImageSelector}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
