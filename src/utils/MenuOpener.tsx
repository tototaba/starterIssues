import { Menu, MenuProps } from '@material-ui/core';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import React, {
  cloneElement,
  ElementType,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
} from 'react';

export interface MenuOpenerProps {
  name?: string;
  button: ReactElement;
  MenuComponent?: ElementType<MenuProps>;
  menuProps?: MenuProps;
  children?: ReactNode;
}

/**
 * Helper to handle open a menu when a button is clicked
 */
export const MenuOpener: FC<MenuOpenerProps> = ({
  MenuComponent = Menu,
  name,
  button,
  menuProps,
  children,
}) => {
  /* @fixme useId as string to bypass error */
  const popupId = 'useId(name)';
  const popupState = usePopupState({ variant: 'popover', popupId });
  const { close } = popupState;

  const click = useCallback(
    e => {
      const isButton = e.target.matches(
        'a, button, input[type="button"], input[type="image"], [role="button"], [role="link"], a *, button *, [role="button"] *, [role="link"] *'
      );
      const isDropdownButton = e.target.matches(
        '.MuiAutocomplete-endAdornment *'
      );

      const closePopup = isButton && !isDropdownButton;

      if (closePopup) {
        close();
      }
    },
    [close]
  );

  return (
    <>
      {cloneElement(button, bindTrigger(popupState))}
      <MenuComponent {...menuProps} {...bindMenu(popupState)} onClick={click}>
        {children}
      </MenuComponent>
    </>
  );
};

export default MenuOpener;
