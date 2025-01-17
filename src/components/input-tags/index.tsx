import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Input } from '../ui';

interface InputTagsProps {
  initialTags?: string[];
  placeholder?: string;
  disabled?: boolean;
}

const InputTags: React.FC<InputTagsProps> = ({ initialTags = [], placeholder, disabled }) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="input-tags w-full">
      <div className="tags-container w-full flex flex-wrap gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full mt-2 p-2 border rounded"
        />
        {tags.map((tag, index) => (
          <Badge key={index} className="bg-primary/80 text-primary-foreground">
            {tag}
            <button
              type="button"
              onClick={() => handleTagRemove(tag)}
              className="ml-2 text-xs text-white-500 hover:text-white-700"
            >
              &times;
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default InputTags;
