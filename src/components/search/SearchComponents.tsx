import React from 'react';
import {
  TextFieldProps,
  TableCell,
  TableCellProps,
  MenuItem,
} from '@material-ui/core';
import { FluentTextField } from 'unity-fluent-library';
import FilterListIcon from '@material-ui/icons/FilterList';

interface FilterPickerFieldProps {
  options: { label: string; value: any }[];
  includePlaceholder?: boolean;
  placeholderLabel?: string;
}

export const FilterTextField = ({ InputProps, ...props }: TextFieldProps) => (
  <FluentTextField
    margin="dense"
    fullWidth
    // TODO: this needs to be changed in the UI library
    style={{ marginTop: -8 }}
    {...props}
    InputProps={{
      style: { paddingRight: 8 },
      inputProps: {
        style: {
          fontSize: 14,
        },
      },
      endAdornment: <FilterListIcon fontSize="small" />,
      ...(InputProps || {}),
    }}
  />
);

export const FilterPickerField = ({
  options,
  includePlaceholder = false,
  placeholderLabel = 'None',
  ...props
}: TextFieldProps & FilterPickerFieldProps) => {
  const { value } = props;

  return (
    <FilterTextField
      {...props}
      select
      InputProps={{
        endAdornment: undefined,
      }}
      SelectProps={{
        displayEmpty: true,
        style: {
          color: value ? 'currentcolor' : 'grey',
          fontSize: 'inherit',
        },
      }}
    >
      {includePlaceholder && (
        <MenuItem style={{ color: 'grey', fontSize: 'inherit' }} value={''}>
          {placeholderLabel}
        </MenuItem>
      )}
      {options &&
        options.map(({ label, value }, index: number) => (
          <MenuItem
            style={{ fontSize: 'inherit' }}
            key={index}
            value={value as any}
          >
            {label}
          </MenuItem>
        ))}
    </FilterTextField>
  );
};

export const FilterTableCell = (props: TableCellProps) => (
  <TableCell style={{ padding: '1em', paddingTop: '0.5em' }} {...props} />
);
