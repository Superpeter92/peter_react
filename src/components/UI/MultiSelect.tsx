import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { useMultiSelect } from "../../utils/hooks/useMultiSelect"; // Import the useMultiSelect hook
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
export type MultiSelectOption<T = any> = {
  id: number;
  name: string;
  permissionId: number;
} & T; // Aggiungi un tipo generico per estendere le opzioni

type MultiSelectProps<T = MultiSelectOption> = {
  label: string;
  name: string;
  value: T[]; // Cambia per accettare un array di opzioni generiche
  disabled?: boolean;
  required?: boolean;
  submitted?: boolean;
  onChange: (value: T[], error: boolean) => void; // Aggiorna per accettare un array
  options: T[]; // Cambia per accettare opzioni generiche
};

export function MultiSelect({
  label,
  name,
  value,
  disabled = false,
  required = false,
  submitted = false,
  options,
  onChange,
}: MultiSelectProps) {
  const { selectedValues, error, handleChange } = useMultiSelect({
    value,
    required,
    onChange,
  });

  return (
    <div className="flex w-full flex-col">
      <Listbox
        as="div"
        disabled={disabled}
        multiple
        value={selectedValues}
        onChange={handleChange}
      >
        {({ open }) => (
          <>
            <Label className="mb-1 font-montserrat text-purplue">{label}</Label>
            <ListboxButton
              className={clsx(
                "relative h-10 w-full cursor-default rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 disabled:bg-gray-100 sm:text-sm",
                {
                  "border-gray-200": !error && !submitted,
                  "border-red-500": error && submitted,
                  "bg-gray-200": disabled,
                },
              )}
            >
              <span className="block truncate">
                {selectedValues.length > 0
                  ? selectedValues
                      .map((opt) =>
                        opt.name 
                      )
                      .join(", ")
                  : "Seleziona un'opzione"}
              </span>
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
                "transition duration-100 ease-in",
                open ? "opacity-100" : "opacity-0",
              )}
            >
              {options.map((opt, index) => (
                <ListboxOption
                key={`${opt.id}-${index}`}
                  value={opt}
                  className={({ focus }) =>
                    clsx(
                      "relative z-50 h-10 cursor-default select-none py-2 pl-10 pr-4",
                      focus ? "bg-amber-100 text-amber-900" : "text-gray-900",
                    )
                  }
                >
                  {({ selected, focus }) => (
                    <>
                      <span
                        className={clsx(
                          "block truncate",
                          selected ? "font-medium" : "font-normal",
                        )}
                      >
                        {opt.name}
                      </span>
                      {selected ? (
                        <span
                          className={clsx(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            focus ? "text-amber-600" : "text-amber-600",
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
          </>
        )}
      </Listbox>
      {error && submitted && !disabled && (
        <p className="font-montserrat text-sm text-red-700">
          Campo Obbligatorio
        </p>
      )}
    </div>
  );
}
