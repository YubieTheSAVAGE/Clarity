import type { SelectHTMLAttributes } from "react";

type SelectOption = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  error?: string;
};

export function Select({
  label,
  options,
  error,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className="ui-select-wrap">
      {label && (
        <label htmlFor={selectId} className="ui-select-label">
          {label}
        </label>
      )}
      <select id={selectId} className={`ui-select ${className}`.trim()} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="ui-select-error">{error}</span>}
    </div>
  );
}
