import type { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  id: string;
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
  multiline?: boolean;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}

export function RoleFormField({
  id,
  label,
  placeholder,
  registration,
  error,
  multiline = false,
  disabled = false,
  dir,
}: Props) {
  const labelClassName = "text-sm font-medium text-foreground";

  const inputClassName =
    "h-11 w-full rounded-xl border-border bg-background shadow-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 disabled:opacity-70";

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      {multiline ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-28 w-full resize-y rounded-xl border-border bg-background shadow-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
          aria-invalid={!!error}
          {...registration}
        />
      ) : (
        <Input
          id={id}
          dir={dir}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClassName} ${dir === "ltr" ? "text-start" : ""}`}
          aria-invalid={!!error}
          {...registration}
        />
      )}

      {error && (
        <p className="text-xs leading-5 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}