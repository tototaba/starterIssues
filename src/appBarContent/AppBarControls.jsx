import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(14),
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    color: theme.palette.getContrastText(theme.palette.common.black),
  },
  left: {
    flex: 1,
    width: '100%',
  },
  right: {
    display: 'flex',
    width: 150,
    justifyContent: 'space-around',
  },
}));

const AppBarControls = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* <div className={classes.left}>
        <FluentIconButton
          aria-label="search"
          className={classes.label}
          icon={SearchIcon}
        />
      </div>
      <div className={classes.right}>
        <FluentIconButton
          aria-label="report"
          className={classes.label}
          icon={BookmarkReportIcon}
        />
        <FluentIconButton
          aria-label="robot"
          className={classes.label}
          icon={RobotIcon}
        />
        <FluentIconButton
          aria-label="lab"
          className={classes.label}
          icon={TestBeakerIcon}
        />
      </div> */}
    </div>
  );
};
export default AppBarControls;
