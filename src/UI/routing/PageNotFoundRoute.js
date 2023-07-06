import React from 'react';
import { makeStyles } from '@material-ui/core';
import { PageNotFound } from 'unity-fluent-library';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4),
  },
}));
const PageNotFoundRoute = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageNotFound
        title="Page Not Found"
        subheader="Sorry, we can't find the page you are looking for."
        message="You may have typed the address incorrectly or you may have used an outdated link."
        to="/"
        buttonLabel="Back to Home Page"
      />
    </div>
  );
};
export default PageNotFoundRoute;
