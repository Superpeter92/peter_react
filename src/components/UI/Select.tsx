import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { useSelect } from "../../utils/hooks/useSelect";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

export type Option = { id: string; nome: string };

type SelectProps = {
  label: string;
  name: string;
  value: Option | null;
  disabled?: boolean;
  required?: boolean;
  initialValue?: string;
  submitted?: boolean;
  onChange: (value: Option | null, error: boolean) => void;
  option: Option[];
};

export function Select({
  label,
  name,
  value,
  disabled = false,
  required = false,
  submitted = false,
  option,
  onChange,
}: SelectProps) {
  const { selectedValue, error, handleChange } = useSelect({
    value,
    required,
    onChange,
  });

  return (
    <div className="w-full flex flex-col">
    <Listbox
      value={selectedValue}
      onChange={handleChange}
      name={name}
      disabled={disabled}
    >
      {({ open }) => (
        <>
          <Label className="mb-1 text-purplue font-montserrat">{label}</Label>
          <div className="relative">
            <ListboxButton
              className={clsx(
                "relative h-10 w-full cursor-default rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-md  disabled:bg-gray-100 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
                {
                  "border-gray-200": !error && !submitted,
                  "border-red-500": error && submitted,
                  "bg-gray-200": disabled,
                }
              )}
            >
              <span className="block truncate">{selectedValue ? selectedValue.nome : 'Seleziona un\'opzione'}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>
            <ListboxOptions 
            transition
              className={clsx(
                "absolute z-[9999] mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                "transition ease-in duration-100",
                open ? "opacity-100" : "opacity-0"
              )}
            >
              
              {option.map((opt) => (
                <ListboxOption
                  key={opt.id}
                  value={opt}
                  className={({ focus }) =>
                    clsx(
                      "relative cursor-default select-none py-2 pl-10 pr-4 h-10 z-50",
                      focus ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    )
                  }
                >
                  {({ selected, focus }) => (
                    <>
                      <span className={clsx("block truncate", selected ? "font-medium" : "font-normal")}>
                        {opt.nome}
                      </span>
                      {selected ? (
                        <span
                          className={clsx(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            focus ? "text-amber-600" : "text-amber-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </>
      )}
    </Listbox>
    {error && submitted && !disabled && (
      <p className="text-red-700 font-montserrat text-sm">Campo Obbligatorio</p>
    )}
  </div>
  );
}
