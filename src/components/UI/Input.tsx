import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useInput } from "../../utils/hooks/useInput";

interface InputProps {
  name: string;
  label?: string;
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  value: string; // Cambia initialValue in value
  onChange: (value: string, error: boolean) => void;
  submitted?: boolean;
  login?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  value,
  onChange,
  submitted,
  login = false,
}) => {
  const {
    value: inputValue,
    error,
    handleChange,
  } = useInput({
    value,
    name,
    required,
    type,
    login,
    onChange,
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const inputClassName = `
    relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 h-10 text-left disabled:bg-grey-100 
    shadow-md focus:border-gray-200 focus:ring-0 sm:text-sm border border-gray-200
    ${error && submitted ? "border-red-500" : ""}
  `;
 console.log(error, type)
  const getErrorMessage = () => {
    if (required && value.trim() === "") return "Campo Obbligatorio";
    if (type === "email" && !login && value.trim() !== "")
      return "Inserire una email valida";
    if (type === "password" && !login && value.trim() !== "")
      return "La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale";
    return "";
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="mb-1 font-montserrat text-purplue">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          disabled={disabled}
          type={type === "password" && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
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
              <EyeSlashIcon className="h-5 w-5 text-purplue" />
            ) : (
              <EyeIcon className="h-5 w-5 text-purplue" />
            )}
          </button>
        )}
      </div>
      {error && submitted && (
        <p className="font-montserrat text-sm text-red-700">
          {getErrorMessage()}
        </p>
      )}
    </div>
  );
};

export default Input;
