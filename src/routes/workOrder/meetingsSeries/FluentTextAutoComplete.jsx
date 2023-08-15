/* eslint-disable no-use-before-define */
import React, { useCallback } from 'react';
import { TextField, makeStyles, Popper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  formTextInput: {
    fontSize: 14
  },
  labelRoot: {
    fontSize: 14
  }
}));

const AutoCompletePopper = (props) => {
  return <Popper {...props} placement='bottom-start' />;
};

export const FluentTextFieldAutoComplete = (props) => {
  const {
    label,
    placeholder,
    options,
    textFieldProps,
    disabled,
    onChange: onChangeProp,
    value,
    optionKey,
    additionalOnChangeAction,
    classes: classProps,
    variant = 'outlined',
    inputProps,
    inputPropClasses,
    customPopper,
    disableClearable = false,
    defaultValue,
    additionalOptionKey,
    isMultiple = false,
    limitTags,
    renderTags,
    size = 'medium',
    ...other
  } = props;

  const classes = useStyles();
  const { autocompleteRoot } = classProps || {};

  const onChange = useCallback(
    (e, value) => {
      if (additionalOnChangeAction) {
        additionalOnChangeAction(value);
      }
      return onChangeProp?.(value);
    },
    [onChangeProp, additionalOnChangeAction]
  );

  return (
    <Autocomplete
      id='autocomplete'
      multiple={isMultiple}
      limitTags={limitTags}
      disabled={disabled}
      options={options || []}
      getOptionLabel={(option) =>
        (option &&
          (optionKey
            ? `${option[optionKey]}${additionalOptionKey ? ` - (${option[additionalOptionKey]})` : ''
            }`
            : option)) ||
        ''
      }
      getOptionSelected={(option, val) =>
        optionKey ? option[optionKey] === val[optionKey] : option === val
      }
      onChange={onChange}
      value={value || (isMultiple ? [] : null)}
      className={autocompleteRoot}
      classes={{
        root: classProps?.formControl
      }}
      PopperComponent={customPopper || AutoCompletePopper}
      disableClearable={disableClearable}
      defaultValue={defaultValue}
      size={size}
      renderInput={(params) => (
        <TextField
          {...textFieldProps}
          {...params}
          {...other}
          label={label}
          margin='dense'
          variant={variant}
          placeholder={placeholder}
          size='small'
          InputProps={{
            ...params.InputProps,
            ...inputProps,
            classes: {
              root: classProps?.inputPropRoot,
              input: clsx(classes.formTextInput, classProps?.inputPropInput)
            }
          }}
          InputLabelProps={{
            classes: {
              root: clsx(classes.labelRoot, classProps?.formLabelRoot)
            }
          }}
        />
      )}
      renderTags={renderTags}
    />
  );
};
