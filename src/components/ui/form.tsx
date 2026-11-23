"use client";

import { useId } from "react";

export const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60";

interface FormFieldProps {
  label: string;
  children: (id: string) => React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      {children(id)}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {children}
    </section>
  );
}