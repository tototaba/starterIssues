import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
}));
const PageLoading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" />
    </div>
  );
};
export default PageLoading;
