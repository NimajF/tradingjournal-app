"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";

type FieldResult = {
  error: string | null;
  notice?: string;
};

type EditableFieldProps = {
  label: string;
  defaultValue: string;
  action: (value: string) => Promise<FieldResult>;
  validate?: (value: string) => string | null; // client validation before sending to server
  normalize?: (value: string) => string; // optional normalization function to format the value before sending to server
  prefix?: string; // optional prefix to display before the input field
  maxLength?: number; // optional max length for the input field
  placeholder?: string; // optional placeholder for the input field
};

// Fade and 4px drift for the action buttons.
const FADE = "transition-[opacity,transform] duration-(--dur-2) ease-(--ease)";

const ICON_BUTTON =
  "inline-flex size-6 items-center justify-center rounded-md text-muted-fg transition-colors duration-(--dur-2) ease-(--ease) hover:bg-surface-alt hover:text-foreground";

export default function EditableField({
  label,
  defaultValue,
  action,
  validate,
  normalize = (v) => v.trim(),
  prefix,
  maxLength,
  placeholder,
}: EditableFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDirty = normalize(value) !== defaultValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(null); // clear error on change
  };

  const handleCancel = () => {
    setValue(defaultValue);
    setError(null);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return; // no changes to save

    const normalizedValue = normalize(value);
    const clientError = validate?.(normalizedValue) ?? null; // run client-side validation if provided
    if (clientError) {
      setError(clientError);
      return;
    }

    setError(null); // clear previous errors
    startTransition(async () => {
      try {
        const result = await action(normalizedValue);
        if (result.error) setError(result.error);
        else setValue(normalizedValue);
      } catch {
        setError("Couldn't save. Check your connection and try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {prefix && <span className="text-muted-fg">{prefix}</span>}

        <div className="relative w-full sm:w-64">
          <input
            ref={inputRef}
            type="text"
            value={value}
            aria-label={label}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
            }}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`h-8 w-full border pl-2.5 text-sm ${
              isDirty ? "pr-16" : "pr-2.5"
            }`}
          />

          {/* Cancel and save fade in only once the value has changed. */}
          <div
            inert={!isDirty}
            className={`absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5 ${FADE} ${
              isDirty
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-1 opacity-0"
            }`}
          >
            <button
              type="button"
              aria-label="Cancel"
              onClick={handleCancel}
              className={ICON_BUTTON}
            >
              <X size={14} />
            </button>
            <button
              type="submit"
              aria-label={isPending ? "Saving" : "Save"}
              disabled={isPending}
              className={`${ICON_BUTTON} text-accent hover:text-accent`}
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="text-xs text-loss animate-in fade-in-0 duration-150 motion-reduce:animate-none"
        >
          {error}
        </p>
      )}
    </form>
  );
}
