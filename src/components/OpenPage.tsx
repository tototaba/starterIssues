import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { OpenPage as UnityOpenPage } from 'unity-fluent-library';

const useStyles = makeStyles(theme => ({
  openPageWithSecondRow: {
    top: 143,
  },
}));

// TODO: integrate this into the library
const OpenPage = ({
  children,
  hasBottomActionRow = false,
  ...props
}: {
  children: any;
  hasBottomActionRow: boolean;
  [key: string]: any;
}) => {
  const classes = useStyles();

  return (
    <UnityOpenPage
      {...props}
      className={clsx(hasBottomActionRow && classes.openPageWithSecondRow)}
    >
      {children}
    </UnityOpenPage>
  );
};

export default OpenPage;
