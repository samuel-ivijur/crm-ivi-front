import React from 'react';
import MaskedInput from 'react-maskedinput';
import { cn } from '@/utils/cn';

interface CustomMaskedInputProps extends MaskedInput.MaskedInputProps {
  className?: string;
}

const CustomMaskedInput = React.forwardRef<HTMLInputElement, CustomMaskedInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <MaskedInput
        ref={ref as React.Ref<MaskedInput>}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);

export default CustomMaskedInput;
