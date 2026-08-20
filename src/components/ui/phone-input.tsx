import * as React from "react";
import InputPhone from "react-phone-number-input/input";
import { getCountries, getCountryCallingCode } from "react-phone-number-input/input";
import Select, { components } from "react-select";
import { cn } from "@/lib/utils";
import type { Country } from "react-phone-number-input";

// Get localized country names
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

// Generate options for react-select
const options = getCountries().map((country) => ({
  value: country,
  label: country,
  name: regionNames.of(country) || country,
  code: "+" + getCountryCallingCode(country),
  icon: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomOption = (props: any) => (
  <components.Option {...props}>
    <div className="flex cursor-pointer items-center gap-3">
      <img src={props.data.icon} alt={props.data.label} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
      <span className="font-medium text-foreground">{props.data.name}</span>
      <span className="ml-auto text-muted-foreground">{props.data.code}</span>
    </div>
  </components.Option>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomSingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      <img src={props.data.icon} alt={props.data.label} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
    </div>
  </components.SingleValue>
);

export interface PhoneInputProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  error?: string;
  defaultCountry?: Country;
  className?: string;
  id?: string;
  placeholder?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, error, value, onChange, defaultCountry = "IN", id, ...props }, ref) => {
    const [country, setCountry] = React.useState<Country>(defaultCountry);
    const selectedOption = options.find((o) => o.value === country) || options.find((o) => o.value === "IN");
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const handleContainerClick = (e: React.MouseEvent) => {
      // Don't steal focus if they clicked the react-select dropdown
      if ((e.target as HTMLElement).closest('.react-select-container')) return;
      const el = document.getElementById(inputId);
      if (el) el.focus();
    };

    const [isMounted, setIsMounted] = React.useState(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    React.useEffect(() => setIsMounted(true), []);

    return (
      <div className="w-full">
        <div
          onClick={handleContainerClick}
          className={cn(
            "flex h-10 w-full items-center rounded-xl border border-border bg-background/80 px-1 text-sm text-foreground shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 dark:bg-card/50",
            error && "border-destructive focus-within:ring-destructive",
            className
          )}
        >
          <Select
            instanceId={inputId + "-select"}
            options={options}
            value={selectedOption}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(val: any) => {
              if (val) setCountry(val.value);
            }}
            components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
            className="react-select-container w-[70px] flex-shrink-0"
            menuPortalTarget={isMounted ? document.body : null}
            styles={{
              control: (base) => ({
                ...base,
                border: 0,
                boxShadow: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                minHeight: "38px",
              }),
              indicatorSeparator: () => ({ display: "none" }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 4px 0 8px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "4px",
                color: "var(--muted-foreground)",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({
                ...base,
                width: "300px",
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
                borderRadius: "0.5rem",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "var(--primary)"
                  : state.isFocused
                  ? "var(--muted)"
                  : "transparent",
                color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
                "&:active": {
                  backgroundColor: "var(--primary)",
                },
              }),
            }}
          />
          <div className="mr-2 border-l border-border pl-2 font-medium text-foreground flex-shrink-0">
            {selectedOption?.code}
          </div>
          <InputPhone
            id={inputId}
            ref={ref as React.ForwardedRef<HTMLInputElement | null>}
            country={country}
            value={value}
            onChange={onChange}
            className="flex-1 h-full w-full bg-transparent px-2 py-2 outline-none border-none focus:ring-0 placeholder:text-muted-foreground min-w-0"
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";
