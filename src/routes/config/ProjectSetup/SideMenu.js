import clsx from 'clsx';
import React from 'react';
import {
  Drawer,
  Hidden,
  makeStyles,
  useTheme,
  Divider,
} from '@material-ui/core';
import { useHeaderStateInfo } from './HeaderContext';
import {
  HEADER_APPBAR_HEIGHT,
  HEADER_STICKYBAR_HEIGHT,
  HEADER_TABBAR_HEIGHT,
} from './Header';
/*import { PRIMARY_ACTION_BUTTON_HEIGHT } from '../ui/PrimaryActionButton';*/
import {PRIMARY_ACTION_BUTTON_HEIGHT} from './PrimaryActionButton';
import NavigationContents from './NavigationContents';

export const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  withLowerHeader: {},
  withHeaderContents: {},
  withStickyHeaderContents: {},
  withTabs: {},
  withCreateAction: {},
  sidebar: {
    position: 'sticky',
    top: HEADER_APPBAR_HEIGHT,
    '&$withCreateAction:not($withLowerHeader)': {
      top:
        HEADER_APPBAR_HEIGHT +
        theme.spacing(2) * 2 +
        PRIMARY_ACTION_BUTTON_HEIGHT -
        8 /* ignore MuiList's 8px margin */,
    },
    '&$withStickyHeaderContents': {
      top: HEADER_APPBAR_HEIGHT + HEADER_STICKYBAR_HEIGHT,
    },
    '&$withTabs': {
      top: HEADER_APPBAR_HEIGHT + HEADER_TABBAR_HEIGHT,
    },
    '&$withStickyHeaderContents$withTabs': {
      top:
        HEADER_APPBAR_HEIGHT + HEADER_STICKYBAR_HEIGHT + HEADER_TABBAR_HEIGHT,
    },
  },
  sidebarPaper: {
    position: 'static',
    background: 'none',
    border: 'none',
    '$withLowerHeader$withCreateAction &': {
      paddingTop: PRIMARY_ACTION_BUTTON_HEIGHT / 2,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    // flexShrink: 0,
  },
  toolbarSpacer: {
    height: HEADER_APPBAR_HEIGHT,
  },
}));

const SideMenu = props => {
  const { drawerOpen, onDrawerClose } = props;
  const classes = useStyles();
  const theme = useTheme();
  const {
    hasLowerHeader,
    hasStickyHeaderContent,
    hasHeaderTabs,
    hasCreateAction,
  } = useHeaderStateInfo();

  const withClasses = {
    [classes.withLowerHeader]: !!hasLowerHeader,
    [classes.withStickyHeaderContents]: !!hasStickyHeaderContent,
    [classes.withTabs]: !!hasHeaderTabs,
    [classes.withCreateAction]: !!hasCreateAction,
  };

  return (
    <>
      <Hidden initialWidth="lg" mdUp>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          variant="temporary"
          open={drawerOpen}
          onClose={onDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.toolbarSpacer} />
          <Divider />
          <NavigationContents />
        </Drawer>
      </Hidden>
      <Hidden initialWidth="lg" smDown>
        <Drawer
          classes={{
            root: clsx(classes.sidebar, withClasses),
            paper: classes.sidebarPaper,
          }}
          variant="permanent"
          open
        >
          <NavigationContents />
        </Drawer>
      </Hidden>
    </>
  );
};

export default SideMenu;
