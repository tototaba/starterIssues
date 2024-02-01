import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';

const ModalAlert = props => {
  const [check, setCheck] = useState();
  const {
    open,
    action,
    title,
    message,
    closeAlert,
    confirm,
    confirmationString,
    disagree = "Disagree",
    agree = "Agree",
    cancelAction,
    table: Table,
    tableProps,
  } = props;

  const confirmAction = event => {
    setCheck(event.target.value);
  };

  const confirmationStringUpdated = confirmationString ?? 'DELETE';
  return (
    <div>
      <Dialog
        open={open}
        onClose={closeAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {Table &&
            <Table {...tableProps} />}
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
          {confirm && (
            <>
              <Typography>
                Type {confirmationStringUpdated} in order to complete this task
              </Typography>
              <TextField
                label="Confirm Action"
                id="confirm"
                variant="outlined"
                fullWidth
                size="small"
                onChange={confirmAction}
                style={{ marginTop: 15 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAction ? cancelAction : closeAlert} color="primary">
            {disagree}
          </Button>
          <Button
            onClick={() => action()}
            onMouseUp={closeAlert}
            color="primary"
            autoFocus
            disabled={confirm && check !== confirmationStringUpdated}
          >
            {agree}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ModalAlert;
