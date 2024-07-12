import { useCallback, useState, useEffect } from "react";

interface UseSelectProps {
  initialValue: string;
  required?: boolean;
}

interface UseSelectReturn {
  selectedValue: string;
  error: boolean;
  handleChange: (value: string) => void;
}

export const useSelect = ({
  initialValue,
  required = false,
}: UseSelectProps): UseSelectReturn => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [error, setError] = useState(false);

  const validateSelect = useCallback((value: string): boolean => {
    if (required && value.trim() === "") return false;
    return true;
  }, [required]);

  useEffect(() => {
    const isValid = validateSelect(selectedValue);
    setError(!isValid);
  }, [selectedValue, validateSelect]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  return { selectedValue, error, handleChange };
};