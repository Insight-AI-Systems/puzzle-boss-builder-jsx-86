
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";

interface CategoryImageUploadProps {
  imageUrl?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const CategoryImageUpload: React.FC<CategoryImageUploadProps> = ({
  imageUrl,
  onChange,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    // Upload to Supabase Storage (simple: category-thumbnails bucket)
    const filePath = `category-thumbnails/${Date.now()}-${file.name}`;
    const { data, error } = await window.supabase.storage
      .from("category-thumbnails")
      .upload(filePath, file, { upsert: false });
    if (!error && data) {
      const url = `${window.supabase.storageUrl}/category-thumbnails/${data.path}`;
      onChange(url);
    } else {
      alert('Image upload failed.');
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="Category thumbnail" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">No Image</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >Upload Image</Button>
    </div>
  );
};
