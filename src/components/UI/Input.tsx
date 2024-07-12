import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useInput } from "../../utils/hooks/useInput";

interface InputProps {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  initialValue?: string;
  onChange: (value: string, error: boolean) => void;
  submitted: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  initialValue = "",
  onChange,
  submitted,
}) => {
  const { value, error, handleChange } = useInput({
    initialValue,
    name,
    required,
    type,
    onChange,
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const inputClassName = `
    relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 h-10 text-left 
    shadow-md focus:border-gray-200 focus:ring-0 sm:text-sm border border-gray-200
    ${error && submitted ? "border-red-500" : ""}
  `;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    if (onChange) {
      onChange(e.target.value, !error); 
    }
  };

  return (
    <div className="flex-col">
      <label htmlFor={name} className="mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          disabled={disabled}
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          aria-invalid={error && submitted}
          className={inputClassName}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && submitted && (
        <p className="text-red-700">
          {required && value.trim() === "" && "Campo Obbligatorio"}
          {type === "email" &&
            value.trim() !== "" &&
            "Inserire una email valida"}
          {type === "password" &&
            value.trim() !== "" &&
            "La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale"}
        </p>
      )}
    </div>
  );
};

export default Input;
