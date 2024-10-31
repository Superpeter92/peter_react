import { useState, useEffect, useCallback } from "react";
import { MultiSelectOption } from "../../components/UI/MultiSelect";

interface UseMultiSelectProps {
  value: MultiSelectOption[] | []; // Array of selected options
  required?: boolean;
  onChange: (value: MultiSelectOption[] | [], error: boolean) => void; // Expecting an array of options
}

interface UseMultiSelectReturn {
  selectedValues: MultiSelectOption[]; // Array of selected options
  error: boolean;
  handleChange: (newValues: MultiSelectOption[] | []) => void; // Function to handle option selection
}

export const useMultiSelect = ({
  value, // Array of selected options
  required = false,
  onChange,
}: UseMultiSelectProps): UseMultiSelectReturn => {
  const [error, setError] = useState(false);

  const validateSelect = useCallback(
    (selectedValues: MultiSelectOption[]): boolean => {
      if (required && selectedValues.length === 0) {
        return false; // Error if required and no options are selected
      }
      return true; // Valid if required condition is met
    },
    [required]
  );

  useEffect(() => {
    const isValid = validateSelect(value);
    setError(!isValid); // Set error state based on validation
  }, [value, validateSelect]);

  const handleChange = useCallback(
    (newValues: MultiSelectOption[] | []) => {
      const isValid = validateSelect(newValues);
      onChange(newValues, !isValid); // Call onChange with the new values
    },
    [validateSelect, onChange]
  );

  return {
    selectedValues: value, // Return the current selected values
    error,
    handleChange, // This will now handle an array of Options
  };
};