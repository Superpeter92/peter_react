import React, { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { useSelect } from "../../utils/hooks/useSelect";

type Option = { id: string; nome: string };

type SelectProps = {
  label: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  initialValue?: string;
  submitted?: boolean;
  onChange?: (value: string, error: boolean) => void;
  option: Option[];
};

export function Select({
  label,
  name,
  initialValue = "",
  disabled = false,
  required = false,
  submitted = false,
  option,
  onChange,
}: SelectProps) {
  const { error, handleChange, selectedValue } = useSelect({
    initialValue: initialValue,
    required,
  });

  const handleSelectChange = (selectedValue: string) => {
    handleChange(selectedValue);
    if (onChange) {
      onChange(selectedValue, error);
    }
  };

  return (
    <div className="w-full flex-col">
      <p className="mb-1">{label}</p>
      <Listbox
        value={selectedValue}
        onChange={handleSelectChange}
        name={name}
        disabled={disabled}
      >
        <div className="relative">
          <ListboxButton
            className={clsx(
              "relative h-10 w-full cursor-default rounded-lg border border-gray-200 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
              {
                "bg-white": !error && !submitted,
                "border-red-300": error && submitted,
                "bg-gray-200": disabled,
              },
            )}
          >
            <span className="block truncate">{selectedValue}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <div className="flex flex-col">
                <i className="fa fa-chevron-up" aria-hidden="true"></i>
                <i className="fa fa-chevron-down" aria-hidden="true"></i>
              </div>
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {!required && (
                <ListboxOption
                  className={({ focus }) =>
                    `relative h-10 cursor-default select-none py-2 pl-10 pr-4 ${
                      focus ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value=""
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      ></span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <i className="fa fa-check" aria-hidden="true"></i>
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              )}
              {option.map((opt) => (
                <ListboxOption
                  key={opt.id}
                  className={({ focus }) =>
                    `relative h-10 cursor-default select-none py-2 pl-10 pr-4 ${
                      focus ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={opt.nome}
                >
                  {({ selected, focus }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {opt.nome}
                      </span>
                      {focus && selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                          <i className="fa fa-check" aria-hidden="true"></i>
                        </span>
                      )}
                      {!focus && selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                          <i className="fa fa-check" aria-hidden="true"></i>
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      {error && submitted && !disabled && (
        <p className="text-red-700">Campo Obbligatorio</p>
      )}
    </div>
  );
}
