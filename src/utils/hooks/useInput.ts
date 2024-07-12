import { useState, useCallback, useEffect } from "react";

const EMAIL_REGEX = /^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface UseInputProps {
  initialValue: string;
  name: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
}

interface UseInputReturn {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useInput = ({
  initialValue,
  required = false,
  type = "text",
}: UseInputProps): UseInputReturn => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);

  const validateInput = useCallback(
    (inputValue: string): boolean => {
      if (required && inputValue.trim() === "") {
        return false;
      }
      if (type === "email" && !EMAIL_REGEX.test(inputValue)) {
        return false;
      }
      if (type === "password" && !PASSWORD_REGEX.test(inputValue)) {
        return false;
      }
      return true;
    },
    [required, type],
  );

  useEffect(() => {
    const isValid = validateInput(value);
    setError(!isValid);
  }, [value, validateInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return { value, setValue, error, handleChange };
};