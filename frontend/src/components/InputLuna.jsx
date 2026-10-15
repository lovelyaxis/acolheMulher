// src/components/Input.jsx
import { useId } from "react";

export default function InputLuna({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}) {
  const id = useId();
  const errorId = `${id}-erro`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        aria-required="true"
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-navy/40 focus:border-brand focus:ring-2 focus:ring-brand/15 ${
          error ? "border-danger" : "border-navy/15"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
