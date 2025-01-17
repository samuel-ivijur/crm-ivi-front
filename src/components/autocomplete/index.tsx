import React, { useState } from 'react';
import { Input } from '../ui';
import './autocomplete.css';
interface AutoCompleteProps {
    suggestions: string[];
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
    disabled?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ suggestions, placeholder, value, setValue, disabled }) => {
    const initialSuggestions = (): string[] => {
        return Array.isArray(suggestions) ? suggestions.slice(0, 10) : [];
    }

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(initialSuggestions());

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        if (!value) {
            setFilteredSuggestions(initialSuggestions())
            setShowSuggestions(true);
            return;
        }

        const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const filtered = suggestions.filter(suggestion =>
            normalize(suggestion.toLowerCase()).includes(normalize(value.toLowerCase()))
        ).slice(0, 10); // Limit to the first 10 suggestions
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setValue(suggestion);
        setShowSuggestions(false);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Check if the blur event is related to clicking a suggestion
        if (!e.relatedTarget || !e.relatedTarget.classList.contains('suggestion-item')) {
            setShowSuggestions(false);
        }
    };

    const handleInputFocus = () => {
        if (value) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 10); // Limit to the first 10 suggestions
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="autocomplete">
            <Input
                type="text"
                value={value}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                placeholder={placeholder}
                disabled={disabled}
                className="autocomplete-input"
            />
            {showSuggestions && (
                <div className="suggestions-container">
                    <div className="suggestions-header">Sugestões</div>
                    <ul className="suggestions-list">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="suggestion-item"
                                tabIndex={0} // Make the suggestion item focusable
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AutoComplete;
