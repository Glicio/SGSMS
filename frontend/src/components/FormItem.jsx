import React from "react";

export default function FormItem({
  type,
  value,
  setValue,
  label,
  required,
  disabled,
}) {
  required = required ? required : false;
  disabled = disabled ? disabled : false;
  if (disabled)
    return (
      <div className="form-item">
        <label htmlFor={label}>{label}</label>
        <input
          required
          autoComplete="new-password"
          type={type}
          value={value}
          disabled
          readOnly
        />
      </div>
    );
  if (required)
    return (
      <div className="form-item">
        <label htmlFor={label}>{label}</label>
        <input
          required
          autoComplete="new-password"
          type={type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
    );
  return (
    <div className="form-item">
      <label htmlFor={label}>{label}</label>
      <input
        autoComplete="new-password"
        type={type}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}
