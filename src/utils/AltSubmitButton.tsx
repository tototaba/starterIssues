import React, {
  forwardRef,
  useCallback,
  useEffect,
  ComponentType,
} from 'react';
import { ButtonProps, Button } from '@material-ui/core';
import { FormSpy, useForm } from 'react-final-form';

export type AltSubmitButtonProps<
  P = {},
  D extends React.ElementType = 'button'
> = Omit<ButtonProps<D, P>, 'onClick'> & { disablePristine: boolean };

type AltSubmitButtonComponent<
  P = {},
  D extends React.ElementType = 'button'
> = ComponentType<AltSubmitButtonProps<P, D>>;

/**
 * Submit button
 */
const AltSubmitButton: AltSubmitButtonComponent = forwardRef((props, ref) => {
  const {
    disabled,
    disablePristine = true,
    name,
    value,
    ...otherProps
  } = props;

  const form = useForm();

  useEffect(() => {
    if (!name) return;

    return form.registerField(
      name,
      () => {},
      {},
      {
        defaultValue: null,
      }
    );
  }, [form, name]);

  const onClick = useCallback(() => {
    if (name) form.change(name, value);
    form.submit();
    if (name) form.change(name, null);
  }, [form, name, value]);

  return (
    <FormSpy subscription={{ submitting: true, pristine: true }}>
      {({ submitting, pristine }) => (
        <Button
          ref={ref}
          type="button"
          disabled={submitting || (disablePristine && pristine) || disabled}
          {...otherProps}
          onClick={onClick}
        />
      )}
    </FormSpy>
  );
});
AltSubmitButton.displayName = 'AltSubmitButton';
export default AltSubmitButton;
