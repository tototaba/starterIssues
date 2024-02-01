import React, { useState } from 'react';
import { FluentIconButton, SideSheet } from 'unity-fluent-library';
import SettingsSideSheet from '../components/SettingsSideSheet';
import { makeStyles } from '@material-ui/core';
import { SettingsIcon } from '@fluentui/react-icons';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(14),
    display: 'flex',
    justifyContent: 'flex-end', // This will align children to the right
  },
  label: {
    color: theme.palette.getContrastText(theme.palette.common.black),
  },
  right: {
    display: 'flex',
    width: 150,
    justifyContent: 'right',
  },
}));

const AppBarControls = props => {
  const classes = useStyles();
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  return (
    <div className={classes.root}>
      <div className={classes.right}>

        <FluentIconButton
          aria-label="robot"
          className={classes.label}
          icon={SettingsIcon}
          onClick={() => setSideSheetOpen(true)}
        />
        <SettingsSideSheet
          isOpen={sideSheetOpen}
          onClose={() => setSideSheetOpen(false)}
        />
      </div>
    </div>
  );
};

export default AppBarControls;

