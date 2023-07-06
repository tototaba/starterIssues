import React from 'react';
import { makeStyles } from '@material-ui/core';
/* import { drawerWidth } from './SideMenu'; */

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    main: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      flex: 1,
      [theme.breakpoints.up('md')]: {
        paddingLeft: ({ leftInset }) => leftInset ?? 0,
      },
    },
    left: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      minWidth: 0,
      [theme.breakpoints.up('md')]: {
        /* minWidth: drawerWidth, */
      },
    },
    right: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    },
  }),
  { name: 'HeaderAlignment' }
);

/**
 * Alignment component for aligning tabs, sticky headers, etc
 */
const HeaderAlignment = props => {
  const classes = useStyles(props);
  const { left, right, children } = props;

  return (
    <div className={classes.root}>
      <div className={classes.left}>{left}</div>
      <div className={classes.main}>{children}</div>
      {right && <div className={classes.right}>{right}</div>}
    </div>
  );
};

export default HeaderAlignment;
