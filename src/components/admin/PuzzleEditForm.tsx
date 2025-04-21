
import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useCategories } from '@/hooks/useCategories';
import { format } from 'date-fns';
import { CalendarIcon, Upload, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type PuzzleEditFormProps = {
  initialData?: Partial<{
    imageUrl: string;
    title: string;
    description: string;
    categories: string[];
    releaseDate: Date;
    pieces: number;
    prizeValue: number;
    incomeTarget: number;
    overrideTarget: boolean;
  }>;
  onSave?: (puzzle: any) => void;
};

const PIECE_OPTIONS = [8, 16, 32, 64, 128, 256, 512];

export const PuzzleEditForm: React.FC<PuzzleEditFormProps> = ({
  initialData = {},
  onSave,
}) => {
  // --- IMAGE HANDLING ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.imageUrl || null);
  const [imageError, setImageError] = useState<string | null>(null);

  // --- FORM FIELDS ---
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [categories, setCategories] = useState<string[]>(initialData.categories || []);
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(
    initialData.releaseDate ? new Date(initialData.releaseDate) : undefined
  );
  const [pieces, setPieces] = useState(initialData.pieces || 8);
  const [prizeValue, setPrizeValue] = useState<number | ''>(initialData.prizeValue || '');
  const [overrideTarget, setOverrideTarget] = useState(initialData.overrideTarget || false);
  const [manualIncomeTarget, setManualIncomeTarget] = useState<number | ''>(initialData.incomeTarget || '');
  const [formError, setFormError] = useState<string | null>(null);

  // --- CATEGORIES ---
  const { data: categoryList, isLoading: categoriesLoading } = useCategories();

  // --- INCOME TARGET LOGIC ---
  const autoIncomeTarget = typeof prizeValue === "number" && prizeValue > 0 ? Math.round(prizeValue * 2) : 0;
  const incomeTarget = overrideTarget && manualIncomeTarget !== '' ? manualIncomeTarget : autoIncomeTarget;

  // --- IMAGE PROCESSING ROUTINE ---
  const STANDARD_SIZE = 1024;
  const handleImageChange = async (file: File) => {
    setImageError(null);
    setImageFile(file);

    // Standardization: Crop/resize, output webp
    const img = new window.Image();
    img.onload = () => {
      // Draw to canvas, force square (center-crop), then resize to STANDARD_SIZE x STANDARD_SIZE
      const side = Math.min(img.width, img.height);
      const offsetX = (img.width - side) / 2;
      const offsetY = (img.height - side) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = STANDARD_SIZE;
      canvas.height = STANDARD_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setImageError('Error processing image');
        return;
      }
      ctx.drawImage(
        img,
        offsetX, offsetY, side, side,
        0, 0, STANDARD_SIZE, STANDARD_SIZE
      );
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            setImagePreview(previewUrl);
          } else {
            setImageError('Error creating image preview');
          }
        },
        'image/webp',
        0.9
      );
    };
    img.onerror = () => setImageError('File could not be loaded');
    img.src = URL.createObjectURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setImageError('Only jpg, png, or webp images allowed');
        return;
      }
      handleImageChange(file);
    }
  };

  // --- CATEGORY HANDLING ---
  const handleCategorySelect = (value: string) => {
    // Multi-select is optional, assume single for now
    setCategories([value]);
  };

  // --- INCOME TARGET OVERRIDE CONTROL ---
  const handleManualOverride = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOverrideTarget(e.target.checked);
    if (!e.target.checked) {
      setManualIncomeTarget('');
    }
  };

  // --- FIELD VALIDATION ---
  const validate = () => {
    if (!title.trim()) return 'Title is required';
    if (!description.trim()) return 'Description is required';
    if (!categories.length) return 'Please select a category';
    if (!releaseDate) return 'Pick a release date';
    if (!pieces) return 'Number of pieces is required';
    if (!prizeValue || (typeof prizeValue === 'string')) return 'Prize value is required';
    if (prizeValue <= 0) return 'Prize value must be positive';
    if (overrideTarget && (!manualIncomeTarget || manualIncomeTarget <= 0)) return 'Manual target must be positive';
    if (!imagePreview) return 'Please import a puzzle image';
    return null;
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    setFormError(err);
    if (err) return;

    const puzzle = {
      imageFile, // as File, can be uploaded in backend integration
      title,
      description,
      category: categories[0],
      releaseDate,
      pieces,
      prizeValue,
      incomeTarget,
      overrideTarget
    };

    if (onSave) onSave(puzzle);
    // Optionally, clear or feedback
  };

  // --- UI RENDER ---
  return (
    <form className="max-w-lg mx-auto p-6 bg-white dark:bg-black rounded-lg shadow space-y-6" onSubmit={handleSubmit}>
      {/* Image Import/Preview Section */}
      <div>
        <Label htmlFor="puzzle-image">Puzzle Image</Label>
        <div className="my-2 flex items-center gap-4">
          <input
            type="file"
            id="puzzle-image"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
          <Button
            variant="outline"
            type="button"
            onClick={() => document.getElementById('puzzle-image')?.click()}
            className="flex items-center gap-2"
          >
            {imagePreview ? <Edit className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {imagePreview ? "Replace Image" : "Import Image"}
          </Button>
          {imageError && <span className="text-red-500 text-xs ml-2">{imageError}</span>}
        </div>
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Puzzle preview" className="max-w-[160px] max-h-[160px] rounded border" />
          </div>
        )}
      </div>

      {/* Title and Description */}
      <div>
        <Label htmlFor="title">Puzzle Title</Label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={80}
          placeholder="Enter puzzle title"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          maxLength={240}
          placeholder="Enter puzzle description/details"
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={categories[0] || ''}
          onValueChange={handleCategorySelect}
          disabled={categoriesLoading}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder={categoriesLoading ? "Loading..." : "Pick a category"} />
          </SelectTrigger>
          <SelectContent>
            {categoryList?.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Release Date */}
      <div>
        <Label>Release Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !releaseDate && "text-muted-foreground"
              )}
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {releaseDate ? format(releaseDate, "PPP p") : <span>Pick a date and time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={releaseDate}
              onSelect={setReleaseDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Pieces (Difficulty Level) */}
      <div>
        <Label htmlFor="pieces">Number of Pieces</Label>
        <Select
          value={String(pieces)}
          onValueChange={val => setPieces(Number(val))}
        >
          <SelectTrigger id="pieces" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PIECE_OPTIONS.map(v => (
              <SelectItem key={v} value={String(v)}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prize Value */}
      <div>
        <Label htmlFor="prize-value">Prize Value</Label>
        <Input
          id="prize-value"
          type="number"
          value={prizeValue}
          min={1}
          onChange={e => setPrizeValue(e.target.value === '' ? '' : Math.abs(Number(e.target.value)))}
          placeholder="Enter prize value (e.g., USD or points)"
        />
      </div>

      {/* Income Target */}
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="income-target">Income Target</Label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="override-target"
              checked={overrideTarget}
              onChange={handleManualOverride}
            />
            <Label htmlFor="override-target" className="text-xs cursor-pointer">Override</Label>
          </div>
        </div>
        <Input
          id="income-target"
          type="number"
          value={incomeTarget}
          min={1}
          disabled={!overrideTarget}
          onChange={e => setManualIncomeTarget(e.target.value === '' ? '' : Math.abs(Number(e.target.value)))}
          className={overrideTarget ? "" : "bg-gray-100 opacity-70"}
        />
        {!overrideTarget && <div className="text-xs mt-1 text-muted-foreground">Auto-calculated as Prize Value × 2</div>}
      </div>

      {/* Error */}
      {formError && <div className="text-red-500 font-medium text-sm">{formError}</div>}

      {/* Save/Update Button */}
      <div>
        <Button type="submit" className="w-full text-lg font-semibold">
          Save / Update Puzzle
        </Button>
      </div>
    </form>
  );
};
