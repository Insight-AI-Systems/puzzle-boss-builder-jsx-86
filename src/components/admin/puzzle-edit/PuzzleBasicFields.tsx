
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface PuzzleBasicFieldsProps {
  puzzle: any;
  categories: any[];
  currentUser?: string;
  onChange: (field: string, value: any) => void;
}

export const PuzzleBasicFields: React.FC<PuzzleBasicFieldsProps> = ({
  puzzle,
  categories,
  currentUser,
  onChange,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="edit-name" className="block mb-1">Puzzle Name</Label>
        <Input
          id="edit-name"
          value={puzzle?.name ?? ""}
          onChange={e => onChange("name", e.target.value)}
          data-testid="edit-name"
          className="mb-1"
          autoFocus
        />
      </div>

      <div>
        <Label htmlFor="edit-puzzleowner" className="block mb-1">Puzzle Owner</Label>
        <Input
          id="edit-puzzleowner"
          value={puzzle?.puzzleOwner ?? currentUser ?? ""}
          onChange={e => onChange("puzzleOwner", e.target.value)}
          data-testid="edit-puzzleowner"
          className="mb-1"
          placeholder="Administrator who set it up"
        />
      </div>

      <div>
        <Label htmlFor="edit-category" className="block mb-1">Category</Label>
        <Select
          value={puzzle?.category ?? ""}
          onValueChange={v => onChange("category", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat: any) => (
              <SelectItem value={cat.name} key={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="edit-supplier" className="block mb-1">Supplier</Label>
        <Input
          id="edit-supplier"
          value={puzzle?.supplier ?? ""}
          onChange={e => onChange("supplier", e.target.value)}
          data-testid="edit-supplier"
          className="mb-1"
          placeholder="e.g. Brand or supplier name"
        />
      </div>

      <div>
        <Label htmlFor="edit-difficulty" className="block mb-1">Difficulty</Label>
        <Select
          value={puzzle?.difficulty ?? ""}
          onValueChange={v => onChange("difficulty", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulty..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">
              <Badge variant="outline" className="mr-2">Easy</Badge>
            </SelectItem>
            <SelectItem value="medium">
              <Badge variant="secondary" className="mr-2">Medium</Badge>
            </SelectItem>
            <SelectItem value="hard">
              <Badge variant="destructive" className="mr-2">Hard</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="edit-description" className="block mb-1">Description</Label>
        <Textarea
          id="edit-description"
          value={puzzle?.description ?? ""}
          onChange={e => onChange("description", e.target.value)}
          data-testid="edit-description"
          className="mb-1"
          placeholder="Enter a description for this puzzle"
        />
      </div>
    </>
  );
};
