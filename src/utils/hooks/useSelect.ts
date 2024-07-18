import { useState, useEffect, useCallback } from "react";
import { Option } from "../../components/UI/Select";

interface UseSelectProps {
  value: Option | null;
  required?: boolean;
  onChange: (value: Option | null, error: boolean) => void;
}

interface UseSelectReturn {
  selectedValue: Option | null;
  error: boolean;
  handleChange: (value: Option | null) => void;
}

export const useSelect = ({
  value, // Usiamo value invece di initialValue
  required = false,
  onChange,
}: UseSelectProps): UseSelectReturn => {
  const [error, setError] = useState(false);

  const validateSelect = useCallback(
    (selectValue: Option | null): boolean => {
      if (required && (!selectValue || selectValue.nome.trim() === "")) {
        return false;
      }
      return true;
    },
    [required]
  );

  useEffect(() => {
    const isValid = validateSelect(value);
    setError(!isValid);
  }, [value, validateSelect]);

  const handleChange = useCallback(
    (newValue: Option | null) => {
      const isValid = validateSelect(newValue);
      onChange(newValue, !isValid);
    },
    [validateSelect, onChange]
  );

  return {
    selectedValue: value, // Usiamo il value passato come prop
    error,
    handleChange,
  };
};
