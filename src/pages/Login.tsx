import React, { useState } from "react";
import { Input } from "../components/UI/Input";
import { Select } from "../components/UI/Select";
type Option = { id: string; nome: string };

type FormField = {
  value: string;
  error: boolean;
};

type FormState = {
  name: FormField;
  email: FormField;
  password: FormField;
  number: FormField;
  option: FormField;
};
const options: Option[] = [
  { id: "1", nome: "Option 1" },
  { id: "2", nome: "Option 2" },
  { id: "3", nome: "Option 3" },
];
const FormComponent: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    name: { value: "", error: false },
    email: { value: "", error: false },
    password: { value: "", error: false },
    number: { value: "", error: false },
    option: { value: "", error: false },
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    field: keyof FormState,
    value: string,
    isValid: boolean,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: { value, error:!isValid },
    }));
    console.log(isValid, field);
  };

  const isFormValid = () => {
    // Controlla se ci sono errori nei campi del form
    const hasErrors = Object.values(formState).some((field) => field.error);
    console.log(hasErrors);

    // Controlla se tutti i campi del form sono compilati
    const allFieldsFilled = Object.values(formState).every(
      (field) => field.value.trim() !== "",
    );

    // Il form è valido se non ci sono errori e tutti i campi sono compilati
    return !hasErrors && allFieldsFilled;
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log(formState);

    e.preventDefault();
    setSubmitted(true);
    if (isFormValid()) {
      // Do something with form data
      console.log(formState);
    } else {
      console.log("Form is invalid");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <form onSubmit={handleSubmit} className="w-1/3 rounded-md p-10 shadow-md">
        <Input
          name="name"
          label="Name"
          type="text"
          placeholder="Enter your name"
          required={true}
          onChange={(value: string, isValid: boolean) =>
            handleChange("name", value, isValid)
          }
          submitted={submitted}
        />
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required={true}
          onChange={(value: string, isValid: boolean) =>
            handleChange("email", value, isValid)
          }
          submitted={submitted}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required={true}
          onChange={(value: string, isValid: boolean) =>
            handleChange("password", value, isValid)
          }
          submitted={submitted}
        />
        <Input
          name="number"
          label="Number"
          type="number"
          placeholder="Enter your number"
          required={true}
          onChange={(value: string, isValid: boolean) =>
            handleChange("number", value, isValid)
          }
          submitted={submitted}
        />
        <Select
          submitted={submitted}
          label="Option"
          name="option"
          onChange={(value: string, isValid: boolean) =>
            handleChange("option", value, isValid)
          }
          option={options}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormComponent;
