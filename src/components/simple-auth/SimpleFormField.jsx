
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const SimpleFormField = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  autoComplete
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
        autoComplete={autoComplete}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SimpleFormField;
