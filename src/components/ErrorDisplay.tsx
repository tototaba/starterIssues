import React, { useState } from 'react';
import { AxiosError } from 'axios';
import {
  Button,
  Collapse,
  Typography,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) => ({
  alertMessage: {
    overflow: 'hidden',
  },
  alertDetails: {
    whiteSpace: 'pre-wrap',
  },
  debugText: {
    overflow: 'auto',
    maxWidth: '100%',
  },
}));

const ErrorDisplay = ({
  title: mainTitle,
  error,
}: {
  title?: string;
  error: AxiosError;
}) => {
  const classes = useStyles();
  const [debugOpen, setDebugOpen] = useState(false);

  const serverResponse = error.response?.data;

  let title, details, debug;

  if (error.response?.status === 409) {
    title = 'This record has changed since you opened it.';
    details = 'Please close and reopen this screen to refresh the data.';
  } else if (error.response?.status === 404) {
    title = 'The record was not found';
    details = 'It may have been deleted or moved. Please refresh to continue.';
  } else if (serverResponse) {
    if (serverResponse.title && serverResponse.errors) {
      title = serverResponse.title;
      details = Object.entries<string[]>(serverResponse.errors)
        .map(([name, subErrors]) => `${name}: ${subErrors.join(' ')}`)
        .join('\n');
    } else if (serverResponse.clientErrorMessage) {
      title = 'Error';
      details = serverResponse.clientErrorMessage;
      debug = serverResponse;
    } else {
      title = 'An unknown server error occurred';
      debug = serverResponse;
    }
  } else {
    title = error.name;
    details = error.message;
    debug = error;
  }

  return (
    <Alert
      severity="error"
      action={
        debug ? (
          <Button onClick={() => setDebugOpen(debugOpen => !debugOpen)}>
            <ExpandMoreIcon /> Debug
          </Button>
        ) : undefined
      }
      classes={{
        message: classes.alertMessage,
      }}
    >
      <AlertTitle>{mainTitle ?? title}</AlertTitle>
      {details && (
        <Typography className={classes.alertDetails}>{details}</Typography>
      )}
      {debug && (
        <Collapse in={debugOpen}>
          <pre className={classes.debugText}>
            {JSON.stringify(debug, null, 2)}
          </pre>
        </Collapse>
      )}
    </Alert>
  );
};

export default ErrorDisplay;
