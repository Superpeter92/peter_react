import { useState, useCallback, useEffect } from "react";

const EMAIL_REGEX = /^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface UseInputProps {
  value: string; // Cambia initialValue in value
  name?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
  onChange: (value: string, error: boolean) => void;
  login: boolean;
}

interface UseInputReturn {
  value: string;
  error: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useInput = ({
  value, // Usa value invece di initialValue
  required = false,
  type = "text",
  login = false,
  onChange,
}: UseInputProps): UseInputReturn => {
  const [error, setError] = useState(false);

  const validateInput = useCallback(
    (inputValue: string): boolean => {
      if (required && inputValue.trim() === "") {
        return false;
      }
      if (type === "email" && !login && !EMAIL_REGEX.test(inputValue)) {
        return false;
      }
      if (type === "password" && !login && inputValue.trim() !== "" && !PASSWORD_REGEX.test(inputValue)) {
        return false;
      }
      return true;
    },
    [required, type, login],
  );

  useEffect(() => {
    const isValid = validateInput(value);
    setError(!isValid);
  }, [value, validateInput]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const newIsValid = validateInput(newValue);
      onChange(newValue, !newIsValid);
    },
    [validateInput, onChange],
  );

  return { value, error, handleChange };
};