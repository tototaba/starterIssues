import React from 'react';
import { TextFieldProps } from '@material-ui/core';
import { Field, FieldProps } from 'formik';
import { FluentTextField } from 'unity-fluent-library';

export const FormikTextField = (
  props: TextFieldProps & { name: string; formatValue?: (value: any) => any }
) => {
  const { name, disabled } = props;
  const { formatValue, ...rest } = props;

  return (
    <Field name={name} disabled={disabled}>
      {({ field, meta }: FieldProps) => (
        <FluentTextField
          // TODO: setting marginTop to zero is a temporary workaround
          // which needs to eventually be changed in the UI library.
          style={{ marginTop: 0 }}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error}
          fullWidth={true}
          {...rest}
          {...field}
          value={formatValue ? formatValue(field.value) : field.value}
        />
      )}
    </Field>
  );
};
