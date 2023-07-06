import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(
  {
    root: {
      display: 'inline-block',
      '& > svg': {
        display: 'inherit',
      },
    },
    default: {
      fontSize: 18,
      width: 18,
      height: 18,
    },
    medium: {
      fontSize: 16,
      width: 16,
      height: 16,
    },
    small: {
      fontSize: 14,
      width: 14,
      height: 14,
    },
  },
  { name: 'FluentIcon' }
);

/**
 * Wrapper for @fluentui/react-icons to provide it with required size
 */
const FluentIcon = props => {
  const classes = useStyles(props);
  const {
    component: IconComponent,
    size = 'default',
    className,
    ...otherProps
  } = props;

  return (
    <IconComponent
      {...otherProps}
      className={clsx(classes.root, className, classes[size])}
    />
  );
};
export default FluentIcon;
