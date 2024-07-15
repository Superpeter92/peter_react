import { useState, useEffect, useCallback } from "react";

interface UseSelectProps {
  initialValue: string;
  required?: boolean;
  onChange: (value: string, error: boolean) => void;
}

interface UseSelectReturn {
  selectedValue: string;
  error: boolean;
  handleChange: (value: string) => void;
}

export const useSelect = ({
  initialValue,
  required = false,
  onChange,
}: UseSelectProps): UseSelectReturn => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [error, setError] = useState(false);

  const validateSelect = useCallback(
    (value: string): boolean => {
      if (required && value.trim() === "") {
        return false;
      }
      return true;
    },
    [required]
  );

  useEffect(() => {
    const isValid = validateSelect(selectedValue);
    setError(!isValid);
  }, [selectedValue, validateSelect]);

  const handleChange = useCallback(
    (value: string) => {
      setSelectedValue(value);
      const isValid = validateSelect(value);
      onChange(value, !isValid);
    },
    [validateSelect, onChange]
  );

  return {
    selectedValue,
    error,
    handleChange,
  };
};