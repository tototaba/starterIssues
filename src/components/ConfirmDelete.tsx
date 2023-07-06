import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import { FluentDialog, FluentButton } from 'unity-fluent-library';

import ErrorDisplay from './ErrorDisplay';

interface ConfirmDeleteProps {
  open: boolean;
  deleteItem: () => Promise<any>;
  handleClose: (del: boolean) => void;
}

const ConfirmDelete = ({
  open,
  deleteItem,
  handleClose,
}: ConfirmDeleteProps) => {
  const transitionDuration = 300;
  const [error, setError] = useState<any | null>(null);

  // TODO: verify that this always clears the error message properly
  useEffect(() => {
    const timeout = setTimeout(() => {
      setError(null);
    }, transitionDuration);

    return () => clearTimeout(timeout);
  }, [open]);

  return error ? (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      transitionDuration={transitionDuration}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Unable to Delete Item</DialogTitle>
      <DialogContent>
        <ErrorDisplay error={error} />
      </DialogContent>
      <DialogActions>
        <FluentButton
          variant="contained"
          onClick={() => handleClose(false)}
          color="primary"
        >
          Close
        </FluentButton>
      </DialogActions>
    </Dialog>
  ) : (
    <FluentDialog
      open={open}
      title="Delete Item"
      message="Are you sure you want to delete this item?"
      labelOne="Delete"
      actionOne={() => {
        deleteItem()
          .then(() => {
            handleClose(true);
          })
          .catch((error: any) => {
            setError(error);
          });
      }}
      labelTwo="Cancel"
      actionTwo={() => handleClose(false)}
      onClose={() => handleClose(false)}
      transitionDuration={transitionDuration}
      aria-labelledby="form-dialog-title"
    />
  );
};

export default ConfirmDelete;
