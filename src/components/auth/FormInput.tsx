
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  autoComplete?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type = 'text',
  label,
  value,
  autoComplete,
  error,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
