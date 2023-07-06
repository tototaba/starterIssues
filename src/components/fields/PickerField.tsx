import React from 'react';
import { useField } from 'formik';

export interface FormikPickerFieldProps {
  name: string;
  children: (props: {
    name: string;
    error: boolean;
    helperText: string | undefined;
    value: any;
    setValue: (value: any) => void;
  }) => React.ReactElement;
}

// TODO: possibly set "disabled" true when "isSubmitting"
export const FormikPickerField = ({
  name,
  children: render,
}: FormikPickerFieldProps) => {
  const [{ value }, { touched, error }, { setValue }] = useField(name);

  return render({
    name,
    error: touched && !!error,
    helperText: (touched && error) || undefined,
    value: value ?? '',
    setValue: value => setValue(value),
  });
};
