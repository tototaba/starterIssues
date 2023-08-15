import React from 'react';
import {
  Button,
  makeStyles,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: theme.palette.primary.main,
  },
  subHeader: {
    marginTop: theme.spacing(3),
  },
  content: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  header: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
  },
  largeDisplay: {
    fontSize: '4rem',
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  message: {
    marginTop: theme.spacing(3),
  },
}));
const PageForbidden = props => {
  const classes = useStyles();
  const {
    title,
    subheader,
    message,
    to,
    buttonLabel,
    statusCode,
    showButton = true,
  } = props;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.content}>
            <div className={classes.header}>
              <div>
                <Typography className={classes.largeDisplay}>
                  {statusCode}
                </Typography>
              </div>
              <div className={classes.subHeader}>
                <Typography variant="h6">{title}</Typography>
              </div>
            </div>
            <div className={classes.message}>
              <Typography variant="overline" style={{ fontWeight: 700 }}>
                {subheader}
              </Typography>
              <div style={{ textAlign: 'left' }}>
                <Typography variant="caption">{message}</Typography>
              </div>
            </div>
            {showButton && (
              <div className={classes.button}>
                <Button
                  component={Link}
                  to={to}
                  variant="contained"
                  color="secondary"
                >
                  {buttonLabel}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageForbidden;
