import React from 'react';
import { MenuItem, TextFieldProps } from '@material-ui/core';
import { FluentTextField } from 'unity-fluent-library';

export interface BasePickerProps<T> {
  name?: string;
  label?: string;
  value: T;
  setValue: (value: T) => void;
  className?: string;
  variant?: TextFieldProps['variant'];
  fullWidth?: boolean;
  margin?: TextFieldProps['margin'];
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  includePlaceholder?: boolean;
  placeholderLabel?: string;
}

export interface PickerProps<T> extends BasePickerProps<T> {
  options: { label: string; value: T }[];
}

export const Picker = <T extends unknown>({
  label,
  value,
  options,
  setValue,
  name = undefined,
  error = false,
  helperText = undefined,
  includePlaceholder = false,
  placeholderLabel = 'None',
  className = '',
  // variant = 'outlined',
  fullWidth = false,
  // margin = undefined,
  required = undefined,
  disabled = undefined,
  autoFocus = undefined,
  readOnly = false,
}: PickerProps<T>) => {
  const optionsLoaded = options.length > 0;

  if (includePlaceholder) {
    options = [{ label: placeholderLabel, value: '' as any }, ...options];
  }

  return (
    <FluentTextField
      // TODO: setting marginTop to zero is a temporary workaround
      // which needs to eventually be changed in the UI library.
      style={{ marginTop: label ? 0 : -8 }}
      // variant={variant}
      className={className}
      fullWidth={fullWidth}
      // margin={margin}
      margin="dense"
      autoFocus={autoFocus}
      disabled={disabled}
      error={error}
      helperText={helperText}
      label={label}
      name={name}
      // Show placeholder/empty value until options have loaded, or if value is nullish
      value={!optionsLoaded ? '' : value ?? ''}
      onChange={(e: any) => setValue(e.target.value as T)}
      // handleChange={(e: any) => setValue(e.target.value as T)}
      required={required}
      select
      SelectProps={{
        inputProps: { readOnly },
        displayEmpty: true,
      }}
      // data={options}
    >
      {options.map(({ label, value }, index: number) => (
        <MenuItem key={index} value={value as any} style={{ fontSize: 14 }}>
          {label}
        </MenuItem>
      ))}
    </FluentTextField>
  );
};

export default Picker;
