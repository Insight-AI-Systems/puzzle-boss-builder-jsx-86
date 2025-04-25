
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FileAttachmentProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  attachment: File | null;
}

const FileAttachment = ({ onFileChange, attachment }: FileAttachmentProps) => {
  return (
    <div className="space-y-2">
      <FormLabel htmlFor="attachment">Attachment (optional)</FormLabel>
      <Input
        id="attachment"
        type="file"
        onChange={onFileChange}
      />
      <p className="text-xs text-muted-foreground">
        Maximum file size: 5MB
      </p>
      {attachment && (
        <p className="text-xs">
          Selected file: {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
        </p>
      )}
    </div>
  );
};

export default FileAttachment;
