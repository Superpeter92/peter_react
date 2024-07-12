import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const EMAIL_REGEX = /^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

 const Input: React.FC<{
  value: string | number;
  onChange: (element: { value: string | number; error: boolean; name: string }) => void;
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  emailRegex?: boolean;
  passwordRegex?: boolean;
  submitted?: boolean;
}> = ({
  value,
  onChange,
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  emailRegex = false,
  passwordRegex = false,
  submitted = false
}) => {
  const [input, setInput] = useState<string>(value?.toString() ?? "");
  // const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = useCallback(() => {
    const isRequiredValid = required ? input.length > 0 : true;
    const isEmailValid = emailRegex ? EMAIL_REGEX.test(input) : true;
    const isPasswordValid = type === 'password' ? PASSWORD_REGEX.test(input) : true;

    return isRequiredValid && isEmailValid && isPasswordValid;
  }, [input, required, emailRegex, type]);

  const isValid = validate();

  useEffect(() => {
    setInput(value?.toString() ?? "");
  }, [value]);

  useEffect(() => {
    if (submitted) {
      onChange({ value: input, error: !isValid, name });
    }
  }, [input, isValid, submitted, onChange, name]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // setTouched(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClassName = `
    relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 h-10 text-left
    shadow-md focus:border-gray-200 focus:ring-0 sm:text-sm border border-gray-200
    ${!isValid && submitted ? 'border-red-500' : ''}
  `;

  return (
    <div className="flex-col">
      <label htmlFor={name} className="mb-1">{label}</label>
      <div className="relative">
        <input
          id={name}
          disabled={disabled}
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          value={input}
          onChange={handleChange}
          // onBlur={() => setTouched(true)}
          aria-invalid={!isValid}
          className={inputClassName}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {!isValid && (submitted) && (
        <p className="text-red-700">
          {!input && required && "Campo Obbligatorio"}
          {input && emailRegex && !EMAIL_REGEX.test(input) && "Inserire una email valida"}
          {input && passwordRegex && type === 'password' && !PASSWORD_REGEX.test(input) && "La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale"}
        </p>
      )}
    </div>
  );
};

export default Input;