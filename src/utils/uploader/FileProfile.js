import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  prefix: {
    fontWeight: 600,
  },
  title: {
    flex: 1,
  },
  detail: {
    marginLeft: theme.spacing(2),
  },
}));

const FileProfile = props => {
  const classes = useStyles();
  const { children, fileName, fileType, size, lastModifiedDate } = props;
  return (
    <>
      <div className={classes.root}>
        <Typography variant="body1" className={classes.title}>
          <strong>{fileName}</strong>
        </Typography>
        <Typography variant="caption" className={classes.detail}>
          <span className={classes.prefix}>Type:</span> {fileType}
        </Typography>
        <Typography variant="caption" className={classes.detail}>
          <span className={classes.prefix}>Size:</span> {size}
        </Typography>
      </div>
      {children}
      {/* Last modified not supported in FireFox */}
      {/* <Typography variant="caption">
        <span className={classes.prefix}>Last Modified:</span>{' '}
        {lastModifiedDate}
      </Typography> */}
    </>
  );
};
export default FileProfile;
