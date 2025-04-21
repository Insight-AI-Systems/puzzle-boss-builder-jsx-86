
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
    
    try {
      const file = e.target.files[0];
      // Upload to Supabase Storage (simple: category-thumbnails bucket)
      const filePath = `category-thumbnails/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from("category-thumbnails")
        .upload(filePath, file, { upsert: false });
        
      if (error) {
        console.error('Image upload error:', error);
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        // Get the public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from("category-thumbnails")
          .getPublicUrl(data.path);

        console.log('Image uploaded successfully:', publicUrlData.publicUrl);
        onChange(publicUrlData.publicUrl);
        
        toast({
          title: "Image Uploaded",
          description: "Category image has been updated"
        });
      }
    } catch (err) {
      console.error('Unexpected error during upload:', err);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive"
      });
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
      >
        Upload Image
      </Button>
    </div>
  );
};
