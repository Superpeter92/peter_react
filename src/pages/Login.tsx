import React, { useState } from "react";
import { Select } from "../components/UI/Select";
import Input from "../components/UI/Input";
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
const Login: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    name: { value: "", error: true },
    email: { value: "", error: true },
    password: { value: "", error: true },
    number: { value: "", error: true },
    option: { value: "", error: true },
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    field: keyof FormState,
    value: string,
    error: boolean,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: { value, error:error },
    }));
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
          onChange={(value: string, error: boolean) =>
            handleChange("name", value, error)
          }
          submitted={submitted}
        />
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required={true}
          onChange={(value: string, error: boolean) =>
            handleChange("email", value, error)
          }
          submitted={submitted}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required={true}
          onChange={(value: string, error: boolean) =>
            handleChange("password", value, error)
          }
          submitted={submitted}
        />
        <Input
          name="number"
          label="Number"
          type="number"
          placeholder="Enter your number"
          required={true}
          onChange={(value: string, error: boolean) =>
            handleChange("number", value, error)
          }
          submitted={submitted}
        />
        <Select
          submitted={submitted}
          label="Option"
          name="option"
          onChange={(value: string, error: boolean) =>
            handleChange("option", value, error)
          }
          option={options}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
