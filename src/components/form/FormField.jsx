
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Reusable form field component with error handling and input length limiting
 */
const FormField = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  className = '',
  maxLength = 1000 // Default max length to prevent extremely large inputs
}) => {
  // Create a wrapped onChange handler that limits input length
  const handleChange = (e) => {
    const input = e.target;
    
    // Allow onChange to proceed only if the input is within length limits
    if (input.value.length <= maxLength) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormField;
