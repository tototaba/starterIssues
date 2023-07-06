import React from 'react';
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from '@material-ui/pickers';
import { FluentIcon, FluentTextField } from 'unity-fluent-library';
import { CalendarIcon } from '@fluentui/react-icons';

const DatePickerField = (props: KeyboardDatePickerProps) => {
  const { style = {}, KeyboardButtonProps = {} } = props;

  return (
    <KeyboardDatePicker
      disableToolbar
      variant="inline"
      {...props}
      style={{ marginTop: -8, ...style }}
      TextFieldComponent={FluentTextField}
      KeyboardButtonProps={{
        style: { borderRadius: 2, width: 32, height: 32 },
        ...KeyboardButtonProps,
      }}
      keyboardIcon={<FluentIcon component={CalendarIcon} size="medium" />}
    />
  );
};

export default DatePickerField;
