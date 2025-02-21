import React from 'react';
import { InputMask } from '@react-input/mask';
import { cn } from '@/utils/cn';

interface InputMaskProps {
  className?: string;
  mask: string;
  onChangeValue: (value: string) => void;
  value: string;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onBlur?: () => void;
}

const InputMaskComponent = React.forwardRef<HTMLInputElement, InputMaskProps>(
  ({ className, mask, onChangeValue, value, placeholder, onBlur, ...props }, ref) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeValue(e.target.value);
    };

    return (
      <InputMask
        ref={ref}
        mask={String(mask).replaceAll('1', '_')}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        replacement={{ _: /\d/ }}
        onBlur={onBlur}
        showMask
        separate
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

export default InputMaskComponent;