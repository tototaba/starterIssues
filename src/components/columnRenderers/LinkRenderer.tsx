import React, { forwardRef, useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface LinkRendererProps {
  value: string;
  data: any;
  getPath: (data: any) => string;
}

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export default forwardRef(function LinkRenderer(
  { value, data, getPath }: LinkRendererProps,
  ref
) {
  const classes = useStyles();

  useImperativeHandle(ref, () => ({
    // Explicitly tell ag-grid that no special logic is needed on data change
    // refresh: () => true,
  }));

  return data ? (
    <Link className={classes.link} to={getPath(data)}>
      {value}
    </Link>
  ) : null;
});
