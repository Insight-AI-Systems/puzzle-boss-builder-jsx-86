
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormFieldProps } from '@/types/registration';

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  error,
  disabled
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'border-red-500' : ''}
        disabled={disabled}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
