import React, { forwardRef } from 'react';
import { makeStyles, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.primary.main,
    marginRight: 5,
  },
  extendedIcon: {
    color: theme.palette.primary.main,
    fontSize: 30,
  },
}));

export const PRIMARY_ACTION_BUTTON_HEIGHT = 48;

let PrimaryActionButton = (props, ref) => {
  const classes = useStyles(props);
  const { onClick, label, ...other } = props;

  return (
    <Fab
      ref={ref}
      onClick={onClick}
      variant="extended"
      aria-label={label}
      {...other}
    >
      <AddIcon className={classes.extendedIcon} />
      {label}
    </Fab>
  );
};
PrimaryActionButton = forwardRef(PrimaryActionButton);

export default PrimaryActionButton;
