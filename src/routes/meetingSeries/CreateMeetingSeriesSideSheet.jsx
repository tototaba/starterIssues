import React, { useRef } from 'react';
import {
  Form,
  Field,
  SideSheet,
} from "unity-fluent-library"
import {
  TextField,
} from '@material-ui/core';

const CreateMeetingSeriesSideSheet = ({ open, onClose, createAction }) => {
  const formRef = useRef(null);

  return (
    <SideSheet
      onClose={onClose}
      width={"400px"}
      title="Create a New Meeting Series"
      open={open}
      buttonLabel="Create"
      onSubmit={() => { createAction(formRef.current.values) }}
    >
      <Form Form ref={formRef} onSubmit={createAction} >
        <Field
          component={TextField}
          label="Title"
          id="Title"
          name="Title"
          fullWidth
          variant="outlined"
          margin="normal"
          size="small"
          required
        />
      </Form >
    </SideSheet>
  );
};

export default CreateMeetingSeriesSideSheet;
