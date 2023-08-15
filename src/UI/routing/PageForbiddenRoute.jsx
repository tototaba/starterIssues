import React from 'react';
import { makeStyles } from '@material-ui/core';
import PageForbidden from './PageForbidden';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4),
  },
}));
const PageForbiddenRoute = props => {
  const { title, statusCode, subheader, message, showButton } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PageForbidden
        title={title ?? 'Page Forbidden'}
        statusCode={statusCode ?? '403'}
        subheader={
          subheader ?? 'Sorry, you do not have permission to view this page.'
        }
        message={message ?? 'Please contact an administrator to get access.'}
        to="/"
        buttonLabel="Back to Home Page"
        showButton={showButton}
      />
    </div>
  );
};
export default PageForbiddenRoute;
