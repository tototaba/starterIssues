import React from 'react';
import { makeStyles, CssBaseline } from '@material-ui/core';

const useStyles = makeStyles(
  theme => ({
    root: {
      textAlign: 'center',
    },
    header: {
      backgroundColor: '#282c34',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'calc(10px + 2vmin)',
      color: 'white',
    },
    logo: {
      height: '40vmin',
      pointerEvents: 'none',
      '@media (prefers-reduced-motion: no-preference)': {
        animation: 'App-logo-spin infinite 20s linear',
      },
    },
    link: {
      color: '#61dafb',
    },
  }),
  { name: 'AppDemo' }
);

/**
 * Demo component for Unity Core
 * @note Delete in real projects
 */
const AppDemo = () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <div className={classes.root}>

      </div>
    </>
  );
};

export default AppDemo;
