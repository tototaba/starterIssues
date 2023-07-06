import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { FluentTextField } from 'unity-fluent-library';

import { statesMap, stateAbbrs } from '../../data/states';

interface StatePickerProps {
  name: string;
  value: string;
  error?: boolean;
  helperText?: string;
  setValue: (newValue: string | null) => void;
}

const useStyles = makeStyles({
  input: {
    paddingTop: '0!important',
    paddingBottom: '0!important',
  },
  option: {
    fontSize: 14,
  },
});

export const StatePicker = ({
  name,
  value,
  setValue,
  error = false,
  helperText = '',
}: StatePickerProps) => {
  const classes = useStyles();

  return (
    <Autocomplete
      id="select-state"
      classes={{
        input: classes.input,
        option: classes.option,
      }}
      options={stateAbbrs}
      getOptionLabel={option => (option ? statesMap[option] ?? 'Unknown' : '')}
      value={value ?? null}
      onChange={(event, newValue: string | null) => {
        setValue(newValue);
      }}
      renderInput={params => (
        <FluentTextField
          {...params}
          // TODO: setting marginTop to zero is a temporary workaround
          // which needs to eventually be changed in the UI library.
          style={{ marginTop: 0 }}
          name={name}
          label="State"
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default StatePicker;
